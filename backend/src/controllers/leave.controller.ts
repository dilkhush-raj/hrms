import {Request, Response} from 'express';
import {Leave} from '../models/leave.model';
import {User} from '../models/user.model';

export const createLeave = async (req: Request, res: Response) => {
  const {email, date, reason, documents} = req.body;

  if (!email || !date || !reason) {
    return res
      .status(400)
      .json({error: 'Email, Date and reason are required fields.'});
  }

  const user = await User.findOne({email});

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }

  const userId = user._id;

  try {
    const newLeave = await Leave.create({
      date,
      reason,
      status: 'Pending',
      document: document,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Leave created successfully',
      leave: newLeave,
    });
  } catch (error) {
    console.error('Error creating leave:', error);
    return res.status(500).json({error: 'Failed to create leave'});
  }
};
