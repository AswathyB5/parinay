import mongoose from 'mongoose';

let cached = globalThis.__parinaya_mongoose_conn;

if (!cached) {
    cached = globalThis.__parinaya_mongoose_conn = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('Missing MONGODB_URI (or MONGO_URI) environment variable.');
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 8000,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};
