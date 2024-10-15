import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./features/tasks/createTaskSlice";
import userReducer from "./features/users/createUserSlice";
export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
