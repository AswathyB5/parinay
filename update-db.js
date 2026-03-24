import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

async function update() {
    console.log('[Maintenance] Connecting to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('[Maintenance] Connected successfully.');

        const doc = await Content.findOne().sort({ createdAt: -1 });
        if (!doc) {
            console.log('[Maintenance] No content document found in DB.');
            process.exit(0);
        }

        const data = doc.data;

        // Update Contact Labels
        if (data.contact) {
            data.contact.addressLabel = "Visit Us";
            console.log('[Maintenance] Updated addressLabel to "Visit Us"');
        }

        const newDoc = new Content({ data });
        await newDoc.save();
        console.log('[Maintenance] Successfully pushed updated data to MongoDB.');

        process.exit(0);
    } catch (err) {
        console.error('[Maintenance Error]', err.message);
        process.exit(1);
    }
}

update();
