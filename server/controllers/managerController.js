const bookingModel = require('../model/bookingModel')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')

const createManager = async (req, res) => {
    try {
        //Ensure only admin can create a manager
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied, only admins can add managers" });
        }

        const { name, email, phone, password } = req.body;

        //Validate input fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //Check if manager already exists
        const existingManager = await userModel.findOne({ email });
        if (existingManager) {
            return res.status(400).json({ message: "Manager with this email already exists" });
        }

        //Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new manager
        const newManager = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "manager",  // Set role to "manager"
        });

        // Save to database
        const savedManager = await newManager.save();

        return res.status(201).json({
            message: "Manager created successfully",
            manager: {
                id: savedManager._id,
                name: savedManager.name,
                email: savedManager.email,
                phone: savedManager.phone,
                role: savedManager.role,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const loginManger = async (req,res)=>{
    try {
        const {email,password}= req.body

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await userModel.findOne({email, role:'manager'})
        if(!user){
            return res.status(404).json({message:"manager not found"})
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({id:user._id,role:'manager'}, process.env.JWT_SECRET_KEY)

        res.status(200).json({message:"Manager login successful",token,user})


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


const turfModel = require('../model/turfModel');

const getManagerData = async (req, res) => {
    try {
      const managerId = req.user._id;
  
      const bookings = await bookingModel.find({ managerId }).populate('userId').populate('turfId');
      const turfs = await turfModel.find({ manager: managerId });
  
      res.status(200).json({ bookings, turfs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
    







module.exports = { createManager,loginManger, getManagerData }