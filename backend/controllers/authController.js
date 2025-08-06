const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Signup
exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashed });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Signup failed', error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", username); // 👈 Yeh add karo

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "Invalid username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(400).json({ message: "Incorrect password" });
        }

        console.log("Login successful");

        // Optional: JWT banana ho toh yahan add karo
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error("Login error:", err); // 👈 Yeh add karo
        res.status(500).json({ message: "Server error" });
    }
};
