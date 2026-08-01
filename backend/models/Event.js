const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    eventType: {
      type: String,
      enum: ['Online Assessment', 'Technical Interview', 'HR Interview', 'Application Deadline'],
      default: 'Technical Interview'
    },
    eventDate: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: '10:00 AM'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

eventSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Event', eventSchema);
