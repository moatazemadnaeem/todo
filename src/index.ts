import * as dotenv from "dotenv";
import { resolve } from "path";
import "express-async-errors";
const envPath = resolve("./src/.env");
dotenv.config({ path: envPath });
import App from "./app";
import CreateUser from "./routes/users/createUser";
import SignIn from "./routes/users/signInUser";
import CurrentUser from "./routes/users/currentUser";
import SignOut from "./routes/users/signoutUser";
import CreateTask from "./routes/tasks/createTask";
import UpdateContentTask from "./routes/tasks/updateContentTask";
import DeleteTask from "./routes/tasks/deleteTask";
import AutoCompleteTask from "./routes/tasks/autoCompleteTask";
import FullTextTask from "./routes/tasks/fullTextSearch";
import StatusFilterTask from "./routes/tasks/statusFilterTask";
new App(
  [
    //Users
    new CreateUser(),
    new SignIn(),
    new CurrentUser(),
    new SignOut(),
    //Tasks
    new CreateTask(),
    new UpdateContentTask(),
    new DeleteTask(),
    new AutoCompleteTask(),
    new FullTextTask(),
    new StatusFilterTask(),
  ],
  parseInt(process.env.PORT!)
);
