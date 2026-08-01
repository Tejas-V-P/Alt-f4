const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    summary: { type: String, default: '' },
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        gradYear: String,
        cgpa: String
      }
    ],
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String
      }
    ],
    projects: [
      {
        title: String,
        techStack: String,
        link: String,
        description: String
      }
    ],
    skills: {
      languages: String,
      frameworks: String,
      tools: String,
      coreSubjects: String
    },
    certifications: [String],
    themeColor: { type: String, default: '#4f46e5' }
  },
  {
    timestamps: true
  }
);

resumeSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
