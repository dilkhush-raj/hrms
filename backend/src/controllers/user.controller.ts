import {Request, Response} from 'express';
import {User} from '../models';
import mongoose from 'mongoose';

const createUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      role,
      status = 'New',
      experience = 0,
      resume,
      position,
    } = req.body;

    console.log(req.body);

    const isemailexist = await User.findOne({email});

    if (isemailexist) {
      res.status(400).json({error: 'Email already exists'});
      return;
    }
    const newUser = new User({
      name: name,
      email: email,
      phoneNumber: phone,
      position: position,
      role,
      status,
      experience,
      resume,
    });

    // Save user to database
    await newUser.save();

    // Send success response
    res.status(201).json({message: 'User created successfully'});
  } catch (error) {
    console.error('Error in createUsers:', error);
    res.status(500).json({error: 'Failed to create user'});
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {page = 0, limit = 10, sort = 'createdAt', role} = req.query;

    const filter = {role: 'candidate'};
    const sortField = typeof sort === 'string' ? sort : 'createdAt';
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const users = await User.find()
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .sort({[sortField]: -1})
      .populate('role');

    if (!users) {
      res.status(404).json({success: false, error: 'No users found'});
    }

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({success: false, error: 'Failed to get all users'});
  }
};

const updateusers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {id} = req.params;
    const {name, email, phone, position, joiningDate} = req.body;
    console.log(name, email, phone, position, joiningDate);

    console.log(id);

    if (!id) {
      throw res.status(400).json({error: 'Missing required fields'});
    }
    //convert candidate to employee
    const userUpdate = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        $set: {
          name,
          email,
          phone,
          position,
          joiningDate,
        },

        $unset: {
          status: 1,
          experience: 1,
          resume: 1,
        },
      },
      {new: true}
    );

    if (!userUpdate) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    console.log('userUpdate:', userUpdate);
    if (userUpdate) {
      res.status(200).json({success: true});
      return;
    }
  } catch (error) {
    console.error('Error in updateusers:', error);
    res.status(500).json({error: 'Failed to update user'});
    return;
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {id} = req.params;

    if (!id) {
      res.status(400).json({error: 'Missing required fields'});
      return;
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    res.status(200).json({success: true});
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({error: 'Failed to delete user'});
    return;
  }
};

const getCandidateUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {page = 0, limit = 10, sort = 'createdAt'} = req.query;
    const filter = {role: 'candidate'};
    const sortField = typeof sort === 'string' ? sort : 'createdAt';
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const users = await User.find(filter)
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .sort({[sortField]: -1})
      .populate('role');

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({success: false, error: 'Failed to get all users'});
  }
};
const getEmployeeUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {page = 0, limit = 10, sort = 'createdAt', role} = req.query;
    const filter = {role: 'employee'};
    const sortField = typeof sort === 'string' ? sort : 'createdAt';
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const users = await User.find(filter)
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .sort({[sortField]: -1})
      .populate('role');

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({success: false, error: 'Failed to get all users'});
  }
};

export {
  getAllUsers,
  getCandidateUsers,
  getEmployeeUsers,
  createUsers,
  updateusers,
  deleteUser,
};
