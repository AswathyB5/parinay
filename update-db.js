import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function synchronize() {
    console.log('[Maintenance] Connecting to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('[Maintenance] Connected successfully.');

        const contentPath = path.join(__dirname, 'src', 'data', 'site-content.json');
        const fileContent = fs.readFileSync(contentPath, 'utf8');
        const data = JSON.parse(fileContent);

        console.log('[Maintenance] Clearing existing content and pushing updated data...');
        console.log('addressLabel:', data.contact.addressLabel);
        console.log('addressHeading:', data.contact.addressHeading);

        // Delete all and save new
        await Content.deleteMany({});
        const doc = new Content({ data });
        await doc.save();
        
        console.log('[Maintenance] Successfully fully synchronized MongoDB with local site-content.json');
        process.exit(0);
    } catch (err) {
        console.error('[Maintenance Error]', err.message);
        process.exit(1);
    }
}

synchronize();
