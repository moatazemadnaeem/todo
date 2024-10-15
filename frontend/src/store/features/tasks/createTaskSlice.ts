import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TaskInter, InitialTasksState } from "../../../types/tasks.types";

const initialState: InitialTasksState = {
  list: [],
  loading: false,
  page: 1,
  arrSize: 0,
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
    addTask: (state, action: PayloadAction<TaskInter>) => {
      if (state.list.length >= 5) {
        state.list.length = 0;
        state.list.push(action.payload);
        state.page += 1;
      } else {
        state.list.push(action.payload);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      if (state.list.length === 1) {
        state.list = state.list.filter((task) => task._id !== action.payload);
        state.page -= 1;
      } else {
        state.list = state.list.filter((task) => task._id !== action.payload);
      }
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
  },
});

export default taskSlice.reducer;
export const {
  addTask,
  getAllTasks,
  editTask,
  deleteTask,
  setPageTask,
  addSizeArr,
  setLoadingTasks,
} = taskSlice.actions;
