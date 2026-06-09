
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
    console.error('No MONGODB_URI found in env');
    process.exit(1);
}

mongoose.connect(mongoUri).then(async () => {
    console.log('Connected to DB');
    const doc = await Content.findOne().sort({ createdAt: -1 });
    if (doc) {
        doc.data.home.achievements = [
            { id: 1, number: '500+', label: 'Happy Couples' },
            { id: 2, number: '4.8/5', label: 'Google Rating' },
            { id: 3, number: '9+', label: 'Years Of Experience' },
            { id: 4, number: '20+', label: 'Strong Team' }
        ];
        doc.markModified('data.home.achievements');
        await doc.save();
        console.log('Updated achievements successfully.');
    } else {
        console.log('No content document found.');
    }
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});

