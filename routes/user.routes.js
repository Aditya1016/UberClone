import {Router} from "express"
import { body } from "express-validator"
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/user.controllers.js"
import {authUser} from "../middleware/auth.middleware.js"

const router = Router()

router.post('/register', [
    body('email').isEmail().withMessage("Invalid email"),
    body('fullname.firstname').isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    body('password').isLength({min:6}).withMessage("Password must be 6 charcters long")
],
    registerUser
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be minimum of 6 length')
],
    loginUser
)

router.get('/profile', authUser, getUserProfile)

router.get('/logout', authUser, logoutUser)

export { router } 