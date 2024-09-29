import {Request, Response} from 'express';
import {Employee, User} from '../models';

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

const getCandidateUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {page = 0, limit = 10, sort = 'createdAt', role} = req.query;
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

export {getAllUsers, getCandidateUsers, getEmployeeUsers};
