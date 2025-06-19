
import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true,
        maxlength: 500
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: {
        type: Date
    },
    approvedBy: {
        type: String
    }
}, {
    timestamps: true
});

// Index for better query performance
TestimonialSchema.index({ isApproved: 1, submittedAt: -1 });
TestimonialSchema.index({ userId: 1 });

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

export default Testimonial;
