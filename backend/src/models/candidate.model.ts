import {User} from './user.model';
import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Scheduled', 'Selected', 'Rejected'],
    default: 'New',
  },
  experience: [
    {
      company: String,
      role: String,
      duration: String,
      description: String,
    },
  ],
  resumeUrl: {
    type: String,
  },
});

export const Candidate = User.discriminator('candidate', CandidateSchema);
