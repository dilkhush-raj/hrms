import mongoose from 'mongoose';
import jwt, {verify} from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

const userBaseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
  timestamps: true,
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ['candidate', 'employee', 'hr', 'admin'],
      default: 'candidate',
      required: true,
    },
    refreshToken: {type: String},
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },

    position: {
      type: String,
    },

    //candidate fields
    status: {
      type: String,
      enum: ['New', 'Scheduled', 'Selected', 'Rejected'],
      default: 'New',
    },
    experience: {
      type: Number,
    },
    resume: {
      type: String,
    },
    //employee fields
    department: {
      type: String,
      required: function (this: any) {
        return this.role === 'employee';
      },
    },
    joiningDate: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  // @ts-ignore
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Pre-findOneAndUpdate middleware to hash password
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as mongoose.UpdateQuery<any>;

  if (update && update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
    } catch (error) {
      return next(error as mongoose.CallbackError);
    }
  }
  next();
});

// Pre-updateOne middleware to hash password
UserSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate() as mongoose.UpdateQuery<any>;

  if (update && update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
    } catch (error) {
      return next(error as mongoose.CallbackError);
    }
  }
  next();
});

UserSchema.methods.isPasswordCorrect = async function (
  password: string | Buffer
) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  const payload: UserPayload = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
  };

  const expiresIn =
    this.role === 'hr'
      ? process.env.HR_ACCESS_TOKEN_EXPIRY
      : process.env.ACCESS_TOKEN_EXPIRY;

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: expiresIn,
  });
};

UserSchema.methods.generateRefreshToken = function () {
  const payload: {id: string} = {
    id: this._id,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model('User', UserSchema);
