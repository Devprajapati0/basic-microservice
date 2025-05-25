import express, { urlencoded } from 'express';
import { connect } from './service/rabbit.js';

 connect(); // Initialize RabbitMQ connection
const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());


import rideRoutes from './routes/rideRoutes.js';
import cookieParser from 'cookie-parser';
app.use('/', rideRoutes);


export default app;