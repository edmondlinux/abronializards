
import mongoose from "mongoose";

const giveawaySchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    entries: { type: Number, default: 1 },
    source: { type: String, enum: ['giveaway', 'giveaway_modal', 'referral'], default: 'giveaway' },
    referrals: { type: Number, default: 0 },
    enteredAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, { minimize: false });

const Giveaway = mongoose.models.giveaway || mongoose.model('giveaway', giveawaySchema);

export default Giveaway;
