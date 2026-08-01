const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
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
    applicationDate: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Online Assessment',
        'Technical Interview',
        'HR Interview',
        'Selected',
        'Rejected'
      ],
      default: 'Applied'
    },
    notes: {
      type: String,
      default: ''
    },
    isWishlist: {
      type: Boolean,
      default: false
    },
    salary: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Application', applicationSchema);
