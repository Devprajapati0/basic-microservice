import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { Ride } from '../models/ride.model.js';
import axios from 'axios';


const autheicator = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userData = await axios.get('http://localhost:3000/user/profile',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        req.user = userData.data.user;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}
export default autheicator;