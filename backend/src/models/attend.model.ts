import {model, Schema, Types} from 'mongoose';

interface IAttend extends Document {
  taskStatus: string;
  status: 'present' | 'absent' | 'medical-leave' | 'work-from-home';
  user: Types.ObjectId;
}

const attendSchema = new Schema<IAttend>(
  {
    taskStatus: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['present', 'absent', 'medical-leave', 'work-from-home'],
      default: 'absent',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Attend = model('attend', attendSchema);
