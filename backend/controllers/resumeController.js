const Resume = require('../models/Resume');

exports.getResume = async (req, res) => {
  try {
    const userId = req.user.id;
    let resume = await Resume.findOne({ userId });
    
    if (!resume) {
      // Return default empty structure
      resume = {
        personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: { languages: '', frameworks: '', tools: '', coreSubjects: '' },
        certifications: [],
        themeColor: '#4f46e5'
      };
    }
    
    res.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error fetching resume details' });
  }
};

exports.saveResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { personalInfo, summary, education, experience, projects, skills, certifications, themeColor } = req.body;

    let resume = await Resume.findOne({ userId });

    if (resume) {
      resume.personalInfo = personalInfo || resume.personalInfo;
      resume.summary = summary !== undefined ? summary : resume.summary;
      resume.education = education || resume.education;
      resume.experience = experience || resume.experience;
      resume.projects = projects || resume.projects;
      resume.skills = skills || resume.skills;
      resume.certifications = certifications || resume.certifications;
      resume.themeColor = themeColor || resume.themeColor;
      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        personalInfo,
        summary,
        education,
        experience,
        projects,
        skills,
        certifications,
        themeColor
      });
    }

    res.json({ message: 'Resume saved successfully', resume });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ message: 'Server error saving resume details' });
  }
};
