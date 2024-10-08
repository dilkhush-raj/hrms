import {query, Request, Response} from 'express';
import {Leave} from '../models/leave.model';
import {User} from '../models/user.model';

const createLeave = async (req: Request, res: Response) => {
  const {email, leaveDate, reason, documentLink} = req.body;

  if (!email || !leaveDate || !reason || !documentLink) {
    return res.status(400).json({error: 'Missing required fields.'});
  }

  const user = await User.findOne({email});

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }

  const userId = user?._id;

  try {
    const newLeave = await Leave.create({
      date: new Date(leaveDate),
      reason,
      documents: documentLink,
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

const getAllLeaves = async (req: Request, res: Response) => {
  const {page = 0, limit = 10, sort = 'createdAt'} = req.query;
  try {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const sortField = typeof sort === 'string' ? sort : 'createdAt';

    const leaves = await Leave.find()
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .sort({[sortField]: -1})
      .populate({
        path: 'user',
        select: '-password -refreshToken -isActive',
      });

    return res.status(200).json({success: true, leaves});
  } catch (error) {
    console.error('Error getting leaves:', error);
    return res.status(500).json({error: 'Failed to get leaves'});
  }
};

const getTodayLeaves = async (req: Request, res: Response) => {
  try {
    // Get the start and end of today's date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    // Fetch leaves for today
    const todaysLeaves = await Leave.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    return res.status(200).json({success: true, todaysLeaves});
  } catch (error) {
    console.error("Error fetching today's leaves:", error);
    return res.status(500).json({error: "Failed to fetch today's leaves"});
  }
};

const updateLeave = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {status} = req.body;

  if (!id) {
    return res.status(400).json({error: 'Leave ID is required'});
  }

  if (!status) {
    return res.status(400).json({error: 'Status is required'});
  }

  try {
    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {new: true}
    );

    if (!leave) {
      return res.status(404).json({error: 'Leave not found'});
    }

    return res.status(200).json({success: true, leave});
  } catch (error) {
    console.error('Error updating leave:', error);
    return res.status(500).json({error: 'Failed to update leave'});
  }
};

const getLeavesbydates = async (req: Request, res: Response) => {
  const {start, end} = req.query;

  if (!start || !end) {
    return res.status(400).json({error: 'Start and end dates are required'});
  }

  try {
    const leaves = await Leave.find({
      date: {
        $gte: new Date(start as string),
        $lt: new Date(end as string),
      },
    });

    return res.status(200).json({success: true, leaves});
  } catch (error) {
    console.error('Error getting leaves by dates:', error);
    return res.status(500).json({error: 'Failed to get leaves by dates'});
  }
};

const deleteLeave = async (req: Request, res: Response) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).json({error: 'Leave ID is required'});
  }

  try {
    const leave = await Leave.findByIdAndDelete(id);

    if (!leave) {
      return res.status(404).json({error: 'Leave not found'});
    }

    return res.status(200).json({success: true, leave});
  } catch (error) {
    console.error('Error deleting leave:', error);
    return res.status(500).json({error: 'Failed to delete leave'});
  }
};

const updateLeaveStatus = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {status} = req.body;

  if (!id) {
    return res.status(400).json({error: 'Leave ID is required'});
  }

  if (!status) {
    return res.status(400).json({error: 'Status is required'});
  }

  try {
    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {new: true}
    );

    if (!leave) {
      return res.status(404).json({error: 'Leave not found'});
    }

    return res.status(200).json({success: true, leave});
  } catch (error) {
    console.error('Error updating leave:', error);
    return res.status(500).json({error: 'Failed to update leave'});
  }
};

const getLeaveCalendar = async (req: Request, res: Response) => {
  const {date} = req.query;

  try {
    let query = {
      status: 'Approved',
      // date: {
      //   $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      //   $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      // },
    };

    if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      query = {
        ...query,
        // date: {
        //   $gte: startOfDay,
        //   $lte: endOfDay,
        // },
      };
    }

    const leaves = await Leave.find(query)
      .populate({
        path: 'user',
        select: 'name',
      })
      .sort({date: 1});

    return res.status(200).json({
      success: true,
      leaves: leaves,
    });
  } catch (error) {
    console.error('Error getting leave calendar:', error);
    return res.status(500).json({error: 'Failed to get leave calendar'});
  }
};

export {
  createLeave,
  getAllLeaves,
  getTodayLeaves,
  getLeavesbydates,
  updateLeave,
  deleteLeave,
  updateLeaveStatus,
  getLeaveCalendar,
};
