const express = require('express');
const { ensureUsersCollection, findUserByEmail, insertUser, closeDatabase } = require('../database/mongoDbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rounter = express();

rounter.post('/register',async(req,res)=>{
    const collectionName = "users";
    try{
    await ensureUsersCollection(collectionName); // Ensure the users collection exists

    const { fullName, email, password, type } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(collectionName,email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { fullName, email, password: hashedPassword, userType:type };

    // Insert user into the database
    await insertUser(collectionName,newUser);

    // Generate JWT Token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: "User registered successfully", token, type });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
} finally {
    await closeDatabase();
}

   
});

module.exports = rounter;