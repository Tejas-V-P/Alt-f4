const mongoose = require('mongoose');

const interviewPrepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Technical', 'System Design', 'HR & Behavioral', 'Coding & DSA'],
      default: 'Technical'
    },
    question: {
      type: String,
      required: true
    },
    answerKey: {
      type: String,
      required: true
    },
    isBookmarked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

interviewPrepSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('InterviewPrep', interviewPrepSchema);
