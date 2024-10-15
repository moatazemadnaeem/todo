import { Response } from "express";
import User from "../../models/userModel";
import { BadReqErr } from "../../error_classes/badReqError";
import { currRequest, text } from "../../types/generalTypes";
import { NotFound } from "../../error_classes/notFoundError";
import mongoose from "mongoose";
import { TaskRes, UserRes } from "../../types/modelsTypes";
import { paginateArray } from "../../utils/paginate";
class TaskController {
  public async create_task(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      user.tasks.push(req.body);
      await user.save();
      res.status(201).send({
        status: true,
        task: user.tasks[user.tasks.length - 1],
        arrSize: user.tasks.length,
      });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
  public async update_task(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { taskId, content, status } = req.body;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      let updatedTask;
      let found = false;
      for (let i = 0; i < user.tasks.length; i++) {
        let singleTask = user.tasks[i];
        if (singleTask._id.toString() === taskId) {
          found = true;
          singleTask.content = content ? content : singleTask.content;
          singleTask.status = status ? status : singleTask.status;
          updatedTask = singleTask;
          await user.save();
          break;
        }
      }
      if (!found) {
        throw new NotFound("Can not find the task please try again!");
      }
      res.status(200).send({
        status: true,
        updatedTask: updatedTask ? updatedTask : "The task is not updated!",
      });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
  public async delete_task(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { taskId } = req.body;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      const newTasks = user.tasks.filter((task) => {
        if (taskId !== task._id.toString()) {
          return task;
        }
      });
      user.tasks = newTasks;
      await user.save();
      res.status(200).send({
        status: true,
        tasks: newTasks,
        arrSize: newTasks.length,
      });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
  public async autocomplete_content(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { content } = req.body;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      if (!content) {
        res.status(200).send({ status: true, tasks: [] });
      } else {
        const mustDocs = [
          {
            equals: {
              value: new mongoose.Types.ObjectId(id),
              path: "_id",
            },
          },
          {
            autocomplete: {
              path: "tasks.content",
              tokenOrder: "sequential",
              query: content,
            },
          },
        ];
        const pipeline = [
          {
            $search: {
              index: "taskIndex",
              compound: {
                must: mustDocs,
              },
              highlight: {
                path: "tasks.content",
              },
            },
          },
          {
            $project: {
              highlights: {
                $meta: "searchHighlights",
              },
            },
          },
        ];
        const highlights = await User.aggregate(pipeline);
        let results = [];
        if (highlights.length > 0) {
          const highlightsArr = highlights[0].highlights;
          if (highlightsArr.length > 0) {
            for (let i = 0; i < highlightsArr.length; i++) {
              let highlight_element: text = highlightsArr[i];
              let concatArray = highlight_element.texts
                .map((elem) => elem.value)
                .join("");
              results.push(concatArray);
            }
          }
        }
        results = [...new Set(results)];
        res.status(200).send({ status: true, tasks: results });
      }
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
  public async full_text_search(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { content, page } = req.body;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      if (!content) {
        const arrSize = user.tasks.length;
        const tasks = paginateArray(user.tasks, page);
        res.status(200).send({ status: true, tasks, arrSize });
      } else {
        const pipeline = [
          {
            $search: {
              index: "taskIndex",
              compound: {
                must: [
                  {
                    equals: {
                      value: new mongoose.Types.ObjectId(id),
                      path: "_id",
                    },
                  },
                  {
                    equals: {
                      value: content,
                      path: "tasks.content",
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              tasks: {
                $filter: {
                  input: "$tasks",
                  as: "task",
                  cond: { $eq: ["$$task.content", content] },
                },
              },
            },
          },
        ];
        const result = await User.aggregate<UserRes>(pipeline);
        let tasksReturned: TaskRes[] | [] = [];
        if (result.length > 0) {
          tasksReturned = result[0].tasks;
        }
        const arrSize = tasksReturned.length;
        const tasks = paginateArray(tasksReturned, page);
        res.send({ status: true, tasks, arrSize });
      }
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
  public async tasks_by_status(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { status } = req.body;
      const user = await User.findById(id);

      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      const tasks = user.tasks.filter((task) => {
        if (task.status === status) {
          return task;
        }
      });
      res.send({ status: true, tasks });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
}
export const taskController = new TaskController();
