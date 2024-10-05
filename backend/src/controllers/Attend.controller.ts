import {Request, Response} from 'express';
import {Attend, User} from '../models';

const createAttend = async (req: Request, res: Response) => {
  const {task, status, email, date} = req.body;
  console.log(task, status, email, date);

  if (!task || !status || !email || !date) {
    return res
      .status(400)
      .json({error: 'Date, User email and Status are required'});
  }

  const user = await User.findOne({email});

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }

  const userId = user?._id;

  try {
    const attend = await Attend.create({
      task,
      status,
      user: userId,
      date: new Date(date),
    });

    return res.status(201).json({success: true, attend});
  } catch (error) {
    console.error('Error creating attend:', error);
    return res.status(500).json({error: 'Failed to create attend'});
  }
};

const getAttends = async (req: Request, res: Response) => {
  try {
    const {page = 0, limit = 10, sort = 'createdAt'} = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const sortField = typeof sort === 'string' ? sort : 'createdAt';

    const attends = await Attend.find()
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .sort({[sortField]: -1})
      .populate({
        path: 'user',
        select: 'name position department email',
      });
    return res.status(200).json({success: true, attends});
  } catch (error) {
    console.error('Error getting attends:', error);
    return res.status(500).json({error: 'Failed to get attends'});
  }
};

const deleteAttend = async (req: Request, res: Response) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).json({error: 'Attend ID is required'});
  }

  try {
    const attend = await Attend.findByIdAndDelete(id);

    if (!attend) {
      return res.status(404).json({error: 'Attend not found'});
    }

    return res.status(200).json({success: true, attend});
  } catch (error) {
    console.error('Error deleting attend:', error);
    return res.status(500).json({error: 'Failed to delete attend'});
  }
};

const updateAttend = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {task, status} = req.body;

  if (!id) {
    return res.status(400).json({error: 'Attend ID is required'});
  }

  try {
    const attend = await Attend.findByIdAndUpdate(
      id,
      {
        $set: {
          task,
          status,
        },
      },
      {new: true}
    );

    if (!attend) {
      return res.status(404).json({error: 'Attend not found'});
    }

    return res.status(200).json({success: true, attend});
  } catch (error) {
    console.error('Error updating attend:', error);
    return res.status(500).json({error: 'Failed to update attend'});
  }
};

const updateAttendStatus = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {status} = req.body;

  if (!id) {
    return res.status(400).json({error: 'Attend ID is required'});
  }

  if (!status) {
    return res.status(400).json({error: 'Status is required'});
  }

  try {
    const attend = await Attend.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {new: true}
    );

    if (!attend) {
      return res.status(404).json({error: 'Attend not found'});
    }

    return res.status(200).json({success: true, attend});
  } catch (error) {
    console.error('Error updating attend:', error);
    return res.status(500).json({error: 'Failed to update attend'});
  }
};

export {
  createAttend,
  getAttends,
  deleteAttend,
  updateAttend,
  updateAttendStatus,
};
