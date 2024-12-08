import {Captain} from "../models/captain.model.js"
import { createCaptain } from "../services/captain.services.js"
import { validationResult } from "express-validator"


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

export {registerCaptain}