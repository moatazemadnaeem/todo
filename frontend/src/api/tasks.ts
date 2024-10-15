import {
  autosearchTasks,
  editTasks,
  searchTasks,
  createTasks,
  deleteTasks,
} from "../services/tasks";
import {
  addSizeArr,
  getAllTasks,
  addTask,
  deleteTask,
  setLoadingTasks,
} from "../store/features/tasks/createTaskSlice";
import { AppDispatch } from "../store";
import { EditTasksArg } from "../types/tasks.types";
export const getAllOrSpecificTasksApi = async (
  text: string | null,
  dispatch: AppDispatch,
  page: number
) => {
  try {
    let reqBody: { content?: string; page: number } = { page: 1 };
    if (text) {
      reqBody = {
        ...reqBody,
        content: text,
        page,
      };
    }
    reqBody = {
      ...reqBody,
      page,
    };
    dispatch(setLoadingTasks(true));
    const { tasks, arrSize } = await searchTasks(reqBody);
    dispatch(getAllTasks(tasks));
    dispatch(addSizeArr(arrSize));
    dispatch(setLoadingTasks(false));
  } catch (error) {
    throw error;
  }
};

export const autoCompleteTasksApi = async (
  text: string | null,
  dispatch: AppDispatch
) => {
  try {
    let reqBody: { content?: string } = {};
    if (text) {
      reqBody = {
        content: text,
      };
    }
    const data = await autosearchTasks(reqBody);
    return data;
  } catch (error) {
    throw error;
  }
};
export const editTasksApi = async (
  reqBody: EditTasksArg,
  dispatch: AppDispatch
) => {
  try {
    const data = await editTasks(reqBody);

    return data;
  } catch (error) {
    throw error;
  }
};
export const createTasksApi = async (
  reqBody: { content: string },
  dispatch: AppDispatch
) => {
  try {
    const { task, arrSize } = await createTasks(reqBody);
    dispatch(addTask(task));
    dispatch(addSizeArr(arrSize));
    return task;
  } catch (error) {
    throw error;
  }
};
export const deleteTasksApi = async (
  reqBody: { taskId: string },
  dispatch: AppDispatch,
  _id: string
) => {
  try {
    const { tasks, arrSize } = await deleteTasks(reqBody);
    dispatch(deleteTask(_id));
    dispatch(addSizeArr(arrSize));
    return tasks;
  } catch (error) {
    throw error;
  }
};
