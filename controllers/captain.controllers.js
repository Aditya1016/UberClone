import {Captain} from "../models/captain.model.js"
import { createCaptain } from "../services/captain.services.js"
import { validationResult } from "express-validator"
import { ApiError } from "../utils/ApiError.js"
import { BlacklistedToken } from "../models/blacklistToken.model.js"


const registerCaptain = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {fullname, email, password, vehicle} = req.body;

    const isCaptainAlreadyRegistered = await Captain.findOne({email})

    if(isCaptainAlreadyRegistered){
        return res.status(400).json({message: 'Captain already exist'})
    }

    const hashedPassword = await Captain.hashPassword(password)

    const captain = await createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    })

    const token = captain.generateAuthToken()

    res.status(200).json({token, captain})

}

const loginCaptain = async (req, res) => {
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

    if(!email || !password){
        return res.status(400).json({
            message: "Both email and password are required",
        });
    }

    const captain = await Captain.findOne({email}).select("+password")

    if(!captain){
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }

    const isMatch = await captain.comparePassword(password)

    if(!isMatch){
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }

    const token = captain.generateAuthToken()

    res.cookie('token', token)

    res.status(200).json({
        token,
        captain
    })
}

const getCaptainProfile = async (req, res) => {
    res.status(200).json(req.captain)
}

const logoutCaptain = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message: "No token provided",
        });
    }

    try {
        await BlacklistedToken.create({token})

        res.clearCookie('token')

        return res.status(200).json({
            message: "Logout successful"
        })
    } catch(err){
        return res.status(400).json({message: "Failed to logout"})
    }
}   

export {
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
}