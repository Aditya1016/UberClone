import {Router} from "express"
import { body } from "express-validator";
import {registerCaptain} from "../controllers/captain.controllers.js"

const router = Router()

router.post(
    '/register',
    [
        body('email').isEmail().withMessage("Invalid email"),

        body('fullname.firstname')
            .isLength({ min: 3 })
            .withMessage("First name must be at least 3 characters long"),
        body('fullname.lastname')
            .optional()
            .isLength({ min: 3 })
            .withMessage("Last name must be at least 3 characters long"),

        body('password')
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),

        body('vehicle.color')
            .isLength({ min: 3 })
            .withMessage("Vehicle color must be at least 3 characters long"),
        body('vehicle.plate')
            .isLength({ min: 3 })
            .withMessage("Vehicle plate must be at least 3 characters long"),
        body('vehicle.capacity')
            .isInt({ min: 1 })
            .withMessage("Vehicle capacity must be at least 1"),
        body('vehicle.vehicleType')
            .isIn(['car', 'motorcycle', 'auto'])
            .withMessage("Invalid vehicle type. Must be one of: car, motorcycle, auto"),
    ],
    registerCaptain
);


export {router}