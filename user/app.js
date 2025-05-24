import express, { urlencoded } from 'express';

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());


import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
app.use('/api/users', userRoutes);


export default app;