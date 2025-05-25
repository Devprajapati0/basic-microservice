import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Captain } from '../models/captain.model.js';
import dotenv from 'dotenv';
dotenv.config();
import { publishToQueue, subscribeToQueue } from '../service/rabbit.js';

//asyncrnous communication and long pooling

const register = async (req, res) => {
    try {
        const { username,email, password } = req.body;

        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Check if the user already exists (this would typically involve a database query)
        const user = await Captain.find({
            email: email,
        })
        if (user.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Here you would typically save the user to your database
        const newUser = new Captain({
            username,
            email,
            password: hashedPassword,
            isAvailble:false
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
        const user = await Captain.findOne({ email });
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
        if (!req.captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ captain: req.captain });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
}

const isAvailble = async (req, res) => {
    try {
        if(!req.captain){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const captain = await Captain.findById(req.captain._id);
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        captain.isAvailble = !captain.isAvailble;
        await captain.save();
        res.status(200).json({ message: `Captain availability set to ${captain.isAvailble}` });

        
       
    } catch (error) {
        res.status(500).json({ message: 'Error checking email availability', error: error.message });
    }
}

const pendingRequests = [];

const waitForNewRide = async (req, res) => {
    console.log(req.captain); // Assuming req.captain is set by middleware

    // Set timeout for long polling (5 seconds)
    const timeoutId = setTimeout(() => {
        res.status(204).end(); // No content
        // Remove this response from pendingRequests if still there
        const index = pendingRequests.indexOf(res);
        if (index !== -1) {
            pendingRequests.splice(index, 1);
        }
    }, 30000);

    // Save the response and its timeout
    pendingRequests.push({ res, timeoutId });
};


// Subscribe to 'new-ride' event
subscribeToQueue('new-ride', (message) => {
    console.log('New ride message received:', message);

    // Notify all pending clients
    pendingRequests.forEach(({ res, timeoutId }) => {
        clearTimeout(timeoutId); // Cancel their timeout
        res.json(JSON.parse(message)); // Send new ride info
    });

    // Clear the list
    pendingRequests.length = 0;
});

export {
    register,
    login,
    logout,
    profile,waitForNewRide,
    isAvailble  ,

}