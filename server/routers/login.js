const express = require('express');
const { executeQuery } = require('../database/queryFunc');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {  findUserByEmail } = require('../database/mongoDbConnection');
const router = express();

router.post('/login',async(req,res)=>{
    try {
        const collectionName = "users";
        const { email, password } = req.body;
    
        // Check if user exists
        const user = await findUserByEmail(collectionName,email);
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRY });
    
        res.json({ message: "Login successful!", token, type: user.userType, userName:user.fullName });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
      }

});

router.post('/getUsers',async(req,res)=>{

})

module.exports = router;