import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['contact', 'quote', 'whatsapp'],
    },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    weddingDate: { type: String, default: '' },
    weddingLocation: { type: String, default: '' },
    guestCount: { type: String, default: '' },
    serviceRequired: { type: String, default: '' },
    message: { type: String, default: '' },
    status: {
        type: String,
        default: 'new',
        enum: ['new', 'read', 'replied', 'archived'],
    },
}, { timestamps: true });

export default mongoose.model('Inquiry', InquirySchema);
