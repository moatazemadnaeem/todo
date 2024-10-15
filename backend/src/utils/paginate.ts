import { TaskRes } from "../types/modelsTypes";

export const paginateArray = (array: TaskRes[], page: number) => {
  const start = (page - 1) * 5;
  const end = start + 5;
  return array.slice(start, end);
};
