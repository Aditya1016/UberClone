import jwt from "jsonwebtoken";
import {BlacklistedToken} from "../models/blacklistToken.model.js";
import { User } from "../models/user.model.js";

const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        // Check if the token is blacklisted
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been blacklisted" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach the user to the request object
        next(); // Proceed to the next middleware or controller
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Unauthorized access" });
    }
};

export { authUser };
