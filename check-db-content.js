import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const doc = await Content.findOne().sort({ createdAt: -1 }).lean();
        if (doc) {
            console.log('--- DB CONTENT START ---');
            console.log(JSON.stringify(doc.data.home.introSubText, null, 2));
            console.log('--- DB CONTENT END ---');
        } else {
            console.log('No content found in DB.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
