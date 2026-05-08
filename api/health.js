import mongoose from 'mongoose';
import { connectDB } from './_lib/db.js';

export default async function handler(_req, res) {
    try {
        await connectDB();
        return res.status(200).json({
            status: 'UP',
            db: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
            time: new Date().toISOString(),
        });
    } catch (error) {
        return res.status(503).json({
            status: 'DOWN',
            db: 'DISCONNECTED',
            error: error.message,
            time: new Date().toISOString(),
        });
    }
}
