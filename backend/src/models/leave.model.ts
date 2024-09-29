import {Schema, model, Types, Document} from 'mongoose';

interface ILeave extends Document {
  date: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  document: string;
  user: Types.ObjectId;
}

const LeaveSchema = new Schema<ILeave>(
  {
    date: {type: Date, required: true},
    reason: {type: String, required: true},
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    document: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  },
  {
    timestamps: true,
  }
);

export const Leave = model('Otp', LeaveSchema);
