export enum StatusEnum {
  NOT_STARTED = "not-started",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}
export interface TaskInter {
  _id: string;
  content: string;
  status: StatusEnum;
}
export interface InitialTasksState {
  list: TaskInter[];
  loading: boolean;
  page: number;
  arrSize: number;
  triggerActionUser: boolean;
  error?: string;
}
export interface IsEditTaskInter extends TaskInter {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  ic_flag: boolean;
}
export type EditTaskValues = { edit_content: string } | { edit_icon: string };
export interface GetTasksInter {
  status: boolean;
  tasks: TaskInter[];
  arrSize: number;
}
export interface AutoTasksInter {
  status: boolean;
  tasks: string[];
}
export interface UpdateTasksInter {
  status: boolean;
  updatedTask: TaskInter;
}
export interface EditTasksArg {
  taskId: string;
  content: string;
  status: StatusEnum;
}
export interface CreateTask {
  status: boolean;
  task: TaskInter;
  tasks: TaskInter[];
  arrSize: number;
}
