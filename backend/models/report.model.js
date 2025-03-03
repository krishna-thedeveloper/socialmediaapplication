import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved', 'ignored'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);