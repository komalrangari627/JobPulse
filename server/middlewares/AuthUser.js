import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/userSchema.js";

dotenv.config({ path: "./config.env" });

const AuthUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw ("Token not found/invalid token !");

        // token may be sent as "Bearer <token>"
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

        const result = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await userModel.findOne({ "email.userEmail": result.email });

        if (!user) throw ("user not found !");

        if (!user.email.verified) throw ('email not verified please verify the email first to perform this action !');

        req.user = user;

        next();

    } catch (err) {
        console.log("auth failed with an error : ", err);
        res.status(401).json({ message: "auth user failed please login !" });
    }
};

export { AuthUser };
