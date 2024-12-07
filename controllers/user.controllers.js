import {User} from "../models/user.model.js"
import {createUser} from "../services/user.service.js"
import { validationResult } from "express-validator"
import { ApiError } from "../utils/ApiError.js";

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

export {registerUser}