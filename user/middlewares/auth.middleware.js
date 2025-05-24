import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models/user.model.js';

const autheicator = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password from user object
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}
export default autheicator;