
import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    source: { type: String, enum: ['footer', 'newsletter'], default: 'newsletter' }
}, { minimize: false });

const Newsletter = mongoose.models.newsletter || mongoose.model('newsletter', newsletterSchema);

export default Newsletter;
