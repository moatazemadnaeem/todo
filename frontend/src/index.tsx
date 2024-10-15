import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import SignIn from "./components/auth/signin";
import SignUp from "./components/auth/signup";
import ErrorNotFoundPage from "./components/errorPage";
import Todo from "./components/tasks";
import ProtectRoute from "./components/protectRoute";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route element={<ProtectRoute />}>
        <Route path="tasks" element={<Todo />} />
      </Route>
      <Route path="*" element={<ErrorNotFoundPage />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />{" "}
  </Provider>
);
