const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ['DSA', 'Aptitude', 'Resume', 'Interview Experience', 'Core Subjects'],
      required: true
    },
    link: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

resourceSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Resource', resourceSchema);
