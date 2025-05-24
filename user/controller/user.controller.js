import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const register = async (req, res) => {
    try {
        const { username,email, password } = req.body;

        // Validate input
        if (!username || !password, !email) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Check if the user already exists (this would typically involve a database query)
        const user = await User.find({
            email: email,
        })
        if (user.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Here you would typically save the user to your database
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        // Optionally, you can create a JWT token for the user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Respond with success

        const options = {
            httpOnly:true,
        }

        res.cookie(
            'token',
            token,
            options
        ).status(201).json({ message: 'User registered successfully', username,email, hashedPassword,token });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const options = {
            httpOnly:true,
        }

        res.cookie(
            'token',
            token,
            options
        ).status(200).json({ message: 'User logged in successfully', username: user.username, email, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
}

const logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token').status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out user', error: error.message });
    }
}

const profile = async (req, res) => {
    try {
        // Assuming req.user is set by an authentication middleware
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ user: req.user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
}
export {
    register,
    login,
    logout,
    profile
}