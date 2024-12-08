import jwt from "jsonwebtoken";
import {BlacklistedToken} from "../models/blacklistToken.model.js";
import { User } from "../models/user.model.js";
import { Captain } from "../models/captain.model.js";

const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
};

const authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await Captain.findById(decoded._id);
        if (!captain) {
            return res.status(404).json({ message: "Captain not found" });
        }

        req.captain = captain; 
        next();  
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
}

export { 
    authUser,
    authCaptain
};
