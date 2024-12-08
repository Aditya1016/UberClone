import { Captain } from "../models/captain.model.js";
import {ApiError} from "../utils/ApiError.js"

const createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType
}) => {
    if (!firstname || !email || !password || !vehicleType || !color || !plate || !capacity) {
        throw new ApiError(
           401,
           "All fields are required" 
        )
    }

    const captain = await Captain.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password,
        vehicle:{
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;
}

export { createCaptain }