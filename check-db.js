import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import fs from 'fs';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const doc = await Content.findOne().sort({ createdAt: -1 }).lean();
        if (doc) {
            const out = `--- LATEST DB CONTENT ---\naddressLabel: ${doc.data.contact.addressLabel}\naddressHeading: ${doc.data.contact.addressHeading}\n`;
            fs.writeFileSync('db-result.txt', out);
        } else {
            fs.writeFileSync('db-result.txt', 'No document found.');
        }
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db-result.txt', err.message);
        process.exit(1);
    }
}

check();
