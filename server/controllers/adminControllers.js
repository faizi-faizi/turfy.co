const userModel = require("../model/userModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");



const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Verify if the user is an admin
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied, not an admin" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });

        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const adminProfile = async (req, res) => {
    try {
        const adminId = req.user._id; // Extract admin ID from the authenticated user
        const admin = await userModel.findById(adminId).select("-password"); // Exclude password

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Access denied, not an admin" });
        }

        res.status(200).json(admin);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};







module.exports = { adminLogin, adminProfile,  }

