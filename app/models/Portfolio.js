import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  about: {
    name: String,
    title: String,
    summary: String,
  },
  resumeUrl: String,
  socialLinks: [{
    platform: String,
    url: String
  }],
  skills: [String],
  education: [{
    degree: String,
    institution: String,
    period: String,
    description: String
  }],
  experience: [{
    title: String,
    company: String,
    tenure: String,
    description: mongoose.Schema.Types.Mixed
  }],
  projects: [{
    name: String,
    link: String,
    description: String,
    techStack: String,
    tenure: String,
    image: String
  }],
  publications: [{
    title: String,
    publisher: String,
    date: String,
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: String
  }],
  training: [{
    course: String,
    institution: String,
    tenure: String
  }],
  resumeText: String,
}, { timestamps: true });

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);