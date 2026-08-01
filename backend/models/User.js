const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String
    },
    googleId: {
      type: String
    },
    githubId: {
      type: String
    },
    avatarUrl: {
      type: String
    },
    linkedinUrl: {
      type: String,
      default: ''
    },
    githubUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
