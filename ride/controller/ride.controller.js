import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Ride } from '../models/ride.model.js';
import dotenv from 'dotenv';
import { subscribeToQueue,publishToQueue } from '../service/rabbit.js';
dotenv.config();

const createRide = async (req, res) => {
    try {
        const { pickup,dropof } = req.body;

        // Validate input
        if (!pickup || !dropof ) {
            return res.status(400).json({ message: 'Ride name, destination, and price are required' });
        }

        // Create a new ride
        const newRide = new Ride({
            pickup,
            dropof,
            user: req.user._id // Assuming req.user is set by the auth middleware
        });

        publishToQueue('new-ride', JSON.stringify(newRide));

        await newRide.save();

        res.status(201).json({ message: 'Ride created successfully', ride: newRide });
    } catch (error) {
        res.status(500).json({ message: 'Error creating ride', error: error.message });
    }
}

const acceptRide = async(req,res) => {
    if(!req.user){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const {rideId} = req.query;
    console.log('Ride ID:', rideId);
    if(!rideId){
        return res.status(400).json({ message: 'Ride ID is required' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
    }
    // Update ride status to accepted
    ride.status = 'accepted';
    await ride.save();
    // Notify all pending clients
    publishToQueue("ride-accepted", JSON.stringify(ride));
    res.status(200).json({ message: 'Ride accepted successfully', ride });
}

export {
    createRide,
    acceptRide
}