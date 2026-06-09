
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Content from './models/Content.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(mongoUri).then(async () => {
    const sourceFile = path.join(__dirname, 'src', 'data', 'site-content.json');
    const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    
    const doc = new Content({ data });
    await doc.save();
    
    console.log('Successfully synced local site-content.json to the MongoDB database!');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});

