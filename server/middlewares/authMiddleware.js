const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader, "===header");

        // Check if the Authorization header exists and follows "Bearer <token>" format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ loginfail: true, status: false, message: "No auth token provided" });
        }

        const authToken = authHeader.split(" ")[1]; // Extract token

        // Decode and verify token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

        //Check if user exists in DB
        const user = await userModel.findById(decoded.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ loginfail: true, status: false, message: "User not found" });
        }

        // Check if user is blocked
        if (user.blockStatus) {
            return res.status(403).json({ Blocked: true, status: false, message: "Your account is suspended" });
        }

        // Attach the full user object to the request
        req.user = {
            ...user.toObject()
        };
        

        next();
    } catch (error) {
        console.error(error); // Log actual error
        return res.status(401).json({ loginfail: true, status: false, message: "Invalid or expired token, please login again" });
    }
};