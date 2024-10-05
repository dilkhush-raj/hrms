import {model, Schema, Types} from 'mongoose';

interface IAttend extends Document {
  task: string;
  status: 'present' | 'absent' | 'medical-leave' | 'work-from-home';
  user: Types.ObjectId;
  date: Date;
}

const attendSchema = new Schema<IAttend>(
  {
    task: {
      type: String,
    },

    status: {
      type: String,
      enum: ['present', 'absent', 'medical-leave', 'work-from-home'],
      default: 'present',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Attend = model('attend', attendSchema);
