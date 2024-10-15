import { AxiosInstance } from "../configs/AxiosConfig";
import {
  AutoTasksInter,
  CreateTask,
  GetTasksInter,
  UpdateTasksInter,
} from "../types/tasks.types";

export const searchTasks = async (
  requestBody: { content?: string; page: number } = { page: 1 }
) => {
  try {
    const { data } = await AxiosInstance.post<GetTasksInter>(
      `tasks/full_text_content`,
      {
        ...requestBody,
      }
    );

    return { tasks: data.tasks, arrSize: data.arrSize };
  } catch (error: any) {
    throw (
      error?.response?.data[0]?.msg || "Something went wrong please try again."
    );
  }
};
export const autosearchTasks = async (
  requestBody: { content?: string } = {}
) => {
  try {
    const { data } = await AxiosInstance.post<AutoTasksInter>(
      `tasks/autocomplete_content`,
      {
        ...requestBody,
      }
    );

    return data.tasks;
  } catch (error: any) {
    throw (
      error?.response?.data[0]?.msg || "Something went wrong please try again."
    );
  }
};
export const editTasks = async (requestBody: {
  content: string;
  taskId: string;
  status: string;
}) => {
  try {
    const { data } = await AxiosInstance.patch<UpdateTasksInter>(
      `tasks/update_content_task`,
      {
        ...requestBody,
      }
    );

    return data.updatedTask;
  } catch (error: any) {
    throw (
      error?.response?.data[0]?.msg || "Something went wrong please try again."
    );
  }
};
export const createTasks = async (requestBody: { content: string }) => {
  try {
    const { data } = await AxiosInstance.post<CreateTask>(`tasks/create_task`, {
      ...requestBody,
    });

    return { task: data.task, arrSize: data.arrSize };
  } catch (error: any) {
    throw (
      error?.response?.data[0]?.msg || "Something went wrong please try again."
    );
  }
};
export const deleteTasks = async (requestBody: { taskId: string }) => {
  try {
    const { data } = await AxiosInstance.post<GetTasksInter>(
      `tasks/delete_task`,
      {
        ...requestBody,
      }
    );

    return { tasks: data.tasks, arrSize: data.arrSize };
  } catch (error: any) {
    throw (
      error?.response?.data[0]?.msg || "Something went wrong please try again."
    );
  }
};
