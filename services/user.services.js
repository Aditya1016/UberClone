import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const createUser = async ({
    firstname, lastname, email, password
}) => {
    if (!firstname || !email || !password) {
        throw new ApiError(
           404,
           "All fields are required" 
        )
    }

    const user = await User.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}

export { createUser }