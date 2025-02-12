import { Request, Response } from 'express';
import { Task } from '../models/taskModel';
import { ObjectId } from 'mongodb';


export const getTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const userObjId = new ObjectId(userId as string);

    const tasks = await Task.aggregate([
      {
        $match: { userId: userObjId }
      },
      {
        $group: {
          _id: "$status",
          items: {
            $push: {
              id: "$_id",
              content: "$content",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          items: 1
        }
      },
      {
        $group: {
          _id: null,
          data: {
            $push: {
              k: "$status",
              v: {
                name: {
                  $cond: {
                    if: { $eq: ["$status", "todo"] },
                    then: "To do",
                    else: {
                      $cond: {
                        if: { $eq: ["$status", "progress"] },
                        then: "In Progress",
                        else: "Done"
                      }
                    }
                  }
                },
                items: "$items"
              }
            }
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: "$data" }
        }
      },

    ]);

    console.log('TASKS: ', tasks);

    if (tasks) {
      res.status(200).json({
        success: true,
        data: tasks
      });
      return
    }

    res.status(400).json({
      success: false,
      message: 'No tasks found'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const exists = await Task.findOne({ content: req.body.content })
    if (exists) {
      res.status(200).json({
        success: false,
        message: 'Same task already exists'
      });
      return
    }

    const newTask = await Task.create(req.body);
    if (newTask) {
      res.status(200).json({
        success: true,
        message: 'New task added',
        data: newTask
      });
      return
    }

    res.status(400).json({
      success: false,
      message: 'Task adding unsuccesfull'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.query;
    const deleted = await Task.deleteOne({ _id: taskId })
    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'Task deleted succesfully'
      });
      return
    }
    res.status(400).json({
      success: false,
      message: 'Task deletion unsuccesfull'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


export const editTask = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { taskId, content } = req.body;
    const updatedTask = await Task.updateOne({ _id: taskId }, { $set: { content } })

    if (updatedTask.modifiedCount) {
      res.status(200).json({
        success: true,
        message: 'Task updated successfully'
      });
      return
    }

    res.status(400).json({
      success: false,
      message: 'Task updation unsuccessfull'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const switchStatus = async (req: Request, res: Response) => {
  try {
    const { taskId, status } = req.body;
    if (status == 'todo' || status == 'progress' || status == 'done') {
      const updatedStatus = await Task.updateOne({ _id: taskId }, { $set: { status } })
      if (updatedStatus.modifiedCount) {
        res.status(200).json({
          success: true,
          message: 'Status updated successfully'
        });
        return
      }
    }
    res.status(400).json({
      success: false,
      message: 'Invalid change of status'
    });
    return

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};