const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    ctc: {
      type: String,
      required: true,
      trim: true
    },
    base: {
      type: String,
      default: ''
    },
    stocks: {
      type: String,
      default: ''
    },
    joiningBonus: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    workMode: {
      type: String,
      default: 'Hybrid'
    },
    workTimingStart: {
      type: String,
      default: '09:00 AM'
    },
    workTimingEnd: {
      type: String,
      default: '06:00 PM'
    },
    rating: {
      type: String,
      default: '4.5 / 5'
    }
  },
  {
    timestamps: true
  }
);

offerSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Offer', offerSchema);
