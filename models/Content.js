import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    data: { type: Object, required: true },
}, { timestamps: true });

export default mongoose.model('Content', ContentSchema);
