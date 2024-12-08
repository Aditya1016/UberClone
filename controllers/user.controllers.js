import {User} from "../models/user.model.js"
import {createUser} from "../services/user.services.js"
import { validationResult } from "express-validator"
import {BlacklistedToken} from "../models/blacklistToken.model.js"

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: "Validation of user not successful",
            details: errors.array()
        });
    }

    const {fullname, email, password} = req.body
    const { firstname, lastname = "" } = fullname;

    const isUserAlreadyRegistered = await User.findOne({email})

    if(isUserAlreadyRegistered){
        return res.status(400).json({message: "User already exists"})
    }

    const hashedPassword = await User.hashPassword(password)
    
    const user = await createUser({
        firstname,
        lastname,
        email,
        password: hashedPassword
    })

    const token = user.generateAuthToken()

    return res
    .status(201)
    .json({token, user})
}

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res
        .status(400)
        .json(
            {
                errors: errors.array()
            }
        )
    }

    const {email, password} = req.body

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({message: "Invalid email or password"})
    }

    const isMatch = await user.comparePassword(password)

    if(!isMatch){
        return res.status(401).json({message: 'Invalid email or password'})
    }

    const token = user.generateAuthToken()

    res.cookie('token', token);

    res.status(200).json({token, user});
}

const getUserProfile = async (req, res) => {
    res.status(200).json(req.user)
}

const logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }

    try {
        await BlacklistedToken.create({ token });

        res.clearCookie("token");

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to log out" });
    }
};


export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
}