import {CookieOptions, Request, Response} from 'express';
import {isValidEmail, isValidPassword} from '../utils';
import {User} from '../models';
import {sendEmail} from '../services';

enum UserRole {
  Candidate = 'candidate',
  Employee = 'employee',
  HR = 'hr',
  Admin = 'admin',
}

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    // @ts-ignore
    const accessToken = await user.generateAccessToken();
    // @ts-ignore
    const refreshToken = await user.generateRefreshToken();
    // @ts-ignore
    user.refreshToken = refreshToken;
    // @ts-ignore
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
  } catch (error) {
    console.error('Failed to generate access and refresh token:', error);
    return {accessToken: null, refreshToken: null};
  }
};

const createUser = async (req: Request, res: Response) => {
  const {name, email, password} = req.body;

  const validateEmailAndUser = async (
    email: string,
    name: string,
    password: string
  ) => {
    if ([name, email, password].some((field) => !field?.trim())) {
      return res.status(400).json({error: 'Missing required fields'});
    }

    const formattedEmail = email.toLowerCase().trim();

    if (!isValidEmail(formattedEmail)) {
      return res.status(400).json({error: 'Invalid email format'});
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({error: 'Invalid password format'});
    }

    return formattedEmail;
  };

  const formattedEmail = await validateEmailAndUser(email, name, password);

  // Check if user already exists
  const existingUser = await User.findOne({email: formattedEmail});

  if (existingUser) {
    return res.status(409).json({error: 'User already exists'});
  }

  // Create new user
  const newUser = await User.create({
    name: name,
    email: formattedEmail,
    password: password,
  });

  // Retrieve created user
  const createdUser = await User.findById(newUser._id).select(
    '_id name email role'
  );

  if (!createdUser) {
    return res.status(500).json({error: 'Failed to retrieve created user'});
  }

  // Send welcome email
  try {
    await sendEmail({
      from: `PSQUARE <${process.env.EMAIL}>`,
      to: email,
      subject: 'Welcome to PSQUARE — let’s get you started!',
      html: `Welcome to PSQUARE, ${name}! 🎉`,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }

  return res
    .status(201)
    .json({success: true, message: 'User registered successfully'});
};

const loginUser = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  const validateEmailAndPassword = async (email: string, password: string) => {
    if (!email?.trim()) {
      return res.status(400).json({error: 'Missing email'});
    }

    if (!password?.trim()) {
      return res.status(400).json({error: 'Missing password'});
    }

    const formattedEmail = email.toLowerCase().trim();

    if (!isValidEmail(formattedEmail)) {
      return res.status(400).json({error: 'Invalid email format'});
    }

    return formattedEmail;
  };

  const formattedEmail = await validateEmailAndPassword(email, password);

  // Find user by email
  const user = await User.findOne({email: formattedEmail});

  if (!user) {
    return res.status(401).json({error: 'Invalid email or password'});
  }

  // @ts-ignore
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({error: 'Invalid email or password'});
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(
    user._id.toString()
  );

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      status: 'success',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const {email} = req.body;
    // @ts-ignore
    const currentUser = req.user;

    const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
    const isDeletingSelf = email === currentUser.email;

    if (!isAdmin && !isDeletingSelf) {
      return res
        .status(403)
        .json({error: 'You are not authorized to delete this user'});
    }

    const formattedEmail = email.toLowerCase().trim();

    if (!isValidEmail(formattedEmail)) {
      return res.status(400).json({error: 'Invalid email format'});
    }

    const user = await User.findOne({email: formattedEmail});

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    await User.deleteOne({email: formattedEmail});

    return res
      .status(200)
      .json({success: true, message: 'User deleted successfully'});
  } catch (error) {
    return res.status(500).json({error: 'Failed to delete user'});
  }
};

const changePassword = async (req: Request, res: Response) => {
  // @ts-ignore
  const email = req.user.email;
  const {password} = req.body;

  const formattedEmail = email.toLowerCase().trim();

  if (!isValidEmail(formattedEmail)) {
    return res.status(400).json({error: 'Invalid email format'});
  }

  const user = await User.findOne({email: formattedEmail});

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({error: 'Invalid password format'});
  }

  user.password = password;
  await user.save();

  return res
    .status(200)
    .json({success: true, message: 'Password changed successfully'});
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const {email, newRole} = req.body;
    // @ts-ignore
    const currentUser = req.user;

    // Check if the current user is HR or Admin
    if (
      currentUser.role !== UserRole.HR &&
      currentUser.role !== UserRole.Admin
    ) {
      return res
        .status(403)
        .json({error: 'You are not authorized to update user roles'});
    }

    // Validate the new role
    if (!Object.values(UserRole).includes(newRole)) {
      return res.status(400).json({error: 'Invalid role'});
    }

    // HR-specific restrictions
    if (currentUser.role === UserRole.HR) {
      if (email === currentUser.email) {
        return res.status(403).json({error: 'HR cannot change their own role'});
      }
      if (newRole === UserRole.Admin || newRole === UserRole.HR) {
        return res
          .status(403)
          .json({error: 'HR cannot assign Admin or HR roles'});
      }
    }

    const formattedEmail = email.toLowerCase().trim();

    if (!isValidEmail(formattedEmail)) {
      return res.status(400).json({error: 'Invalid email format'});
    }

    const user = await User.findOne({email: formattedEmail});

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    // Update the user's role
    user.role = newRole;
    await user.save();

    return res
      .status(200)
      .json({success: true, message: 'User role updated successfully'});
  } catch (error) {
    return res.status(500).json({error: 'Failed to update user role'});
  }
};

const logOutUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $unset: {refreshToken: 1},
      },
      {new: true}
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json({
        status: 'success',
        user: null,
      });
  } catch (error) {
    return res.status(500).json({error: 'Failed to log out user'});
  }
};

const isLoggedIn = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const {_id} = req.user;

    if (!_id) {
      return res.status(200).json({success: false, message: 'User not found'});
    }

    const user = await User.findById(_id).select('-password');

    if (!user) {
      return res.status(200).json({success: false, message: 'User not found'});
    }

    return res.status(200).json({success: true, user});
  } catch (error) {
    return res
      .status(500)
      .json({error: 'Failed to check if user is logged in'});
  }
};

export {
  createUser,
  loginUser,
  deleteUser,
  changePassword,
  updateUserRole,
  logOutUser,
  isLoggedIn,
};
