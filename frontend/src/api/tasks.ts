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
  setLoadingTasks,
  setPageTask,
  triggerAction,
} from "../store/features/tasks/createTaskSlice";
import { AppDispatch } from "../store";
import { EditTasksArg, StatusEnum } from "../types/tasks.types";
export const getAllOrSpecificTasksApi = async (
  text: string | null,
  dispatch: AppDispatch,
  page: number,
  status: string | null
) => {
  try {
    let reqBody: { content?: string; page: number; status?: string } = {
      page,
    };
    if (text) {
      reqBody = {
        ...reqBody,
        content: text,
      };
    }
    if (status) {
      reqBody = {
        ...reqBody,
        status,
      };
    }
    dispatch(setLoadingTasks(true));
    const { tasks, arrSize } = await searchTasks(reqBody);
    dispatch(getAllTasks(tasks));
    dispatch(addSizeArr(arrSize));
    dispatch(setLoadingTasks(false));
    if (page === 1) {
      dispatch(setPageTask(1));
    }
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
    dispatch(setPageTask(1));
    dispatch(triggerAction());
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
    const { task } = await createTasks(reqBody);
    dispatch(setPageTask(1));
    dispatch(triggerAction());

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
    const { tasks } = await deleteTasks(reqBody);
    dispatch(setPageTask(1));
    dispatch(triggerAction());

    return tasks;
  } catch (error) {
    throw error;
  }
};
