import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TaskInter, InitialTasksState } from "../../../types/tasks.types";

const initialState: InitialTasksState = {
  list: [],
  loading: false,
  page: 1,
  arrSize: 0,
  triggerActionUser: false,
};
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    getAllTasks: (state, action: PayloadAction<TaskInter[]>) => {
      state.list.length = 0;
      state.list.push(...action.payload);
    },
    setLoadingTasks: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addSizeArr: (state, action: PayloadAction<number>) => {
      state.arrSize = action.payload;
    },
    addTasks: (state, action: PayloadAction<TaskInter>) => {
      state.list.push(action.payload);
    },
    setPageTask: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    editTask: (state, action: PayloadAction<TaskInter>) => {
      state.list.map((task) => {
        if (task._id === action.payload._id) {
          task.content = action.payload.content;
          task.status = action.payload.status;
        }
      });
    },
    triggerAction: (state) => {
      state.triggerActionUser = !state.triggerActionUser;
    },
  },
});

export default taskSlice.reducer;
export const {
  addTasks,
  getAllTasks,
  editTask,
  setPageTask,
  addSizeArr,
  setLoadingTasks,
  triggerAction,
} = taskSlice.actions;
