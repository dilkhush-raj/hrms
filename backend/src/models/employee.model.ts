import {User} from './user.model';
import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  tasks: [
    {
      taskName: {
        type: String,
        required: true,
      },
      taskStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
      },
    },
  ],
});

export const Employee = User.discriminator('employee', EmployeeSchema);
