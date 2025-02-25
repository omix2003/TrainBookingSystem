import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
}, { timestamps: true });


export const Payment = mongoose.model('Payment', paymentSchema);
