import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const ContentSchema = new mongoose.Schema({
    data: Object,
}, { timestamps: true });

const Content = mongoose.model('Content', ContentSchema);

async function sync() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('No MONGODB_URI found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const localDataPath = path.join(__dirname, 'src', 'data', 'site-content.json');
        const localData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));

        const newContent = new Content({ data: localData });
        await newContent.save();
        console.log('Successfully synced local site-content.json to MongoDB');
        
        process.exit(0);
    } catch (err) {
        console.error('Sync failed:', err);
        process.exit(1);
    }
}

sync();
