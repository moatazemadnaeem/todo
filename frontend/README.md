# Todo

Hey there 🙂

Technologies Used are :

1. NodeJs
2. ExpressJs
3. Json Web Token
4. MongoDB
5. Typescript
6. React Js
7. Redux Toolkit
8. React Router Dom
9. Ant Design

# Auth

In this section I will explain `authentication` flow on `frontend` and `backend`.

## Frontend

pages that handle authentication are :

1. sign up
2. sign In

### Sign up

![image.png](todo_readme_imgs/image.png)

In the above image we will see there are 3 integral parts of our sign up page and they are name, email, password[.](http://password.In) once filling all of the inputs and press sign up button it will directs you to the sign in page for now i did not used email confirmation to make the process easy if something goes wrong this will raise an error message lets see it:

![image.png](todo_readme_imgs/image%201.png)

This error message indicates that i entered email that already exist on the DB.

### Sign In

![image.png](todo_readme_imgs/image%202.png)

In the sign in page now you can start enter the email and password that you just created on the sign up and as you guessed it raise an error if something goes wrong on the server.

---

## Backend

I have implemented 3 features on the backend and they are :

1. sign up
2. sign in
3. sign out
4. current user

### Sign up

In The Sign up You will be able to create the user , there are validations on the request made to this request to make sure the user created on the DB with the proper structure lets see code example that intercept the request and make sure the request have the proper structure.

```jsx
import { Router } from "express";
import __Router from "../../types/routerType";
import { body } from "express-validator";
import { userController } from "../../controllers/userController/user";
import { validatereq } from "../../middlewares/validateReq";
class CreateUser implements __Router {
  path = "/users/create_user";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      [
        body("name")
          .trim()
          .isLength({ min: 3, max: 255 })
          .withMessage("name must be at least 3 chars long and 255 max"),
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
          .trim()
          .isLength({ min: 6, max: 255 })
          .withMessage("Password must be at least 6 chars long and 255 max"),
      ],
      validatereq,
      userController.create_user
    );
  }
}

export default CreateUser;
```

In The above example i check the name , email , password.

- `name`
  must be between 3 characters long and 255 max
- `email`
  must be valid email
- `password`
  must be between 6 characters long and 255 max

now lets go to the fun part the actual code for sign up.

```jsx
public async create_user(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) {
        throw new BadReqErr("Email is already in use");
      }
      await User.create({
        name,
        email,
        password: hashPass(password),
      });

      res.status(201).send({
        status: true,
        msg: "User Created Successfully.",
      });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
```

In the above code example I check if the user exist on the DB or not if so throw an error
if not continue and add the user to DB.

### Sign In

It will works the same on the validation but without name validation

```jsx
import { Router } from "express";
import __Router from "../../types/routerType";
import { body } from "express-validator";
import { userController } from "../../controllers/userController/user";
import { validatereq } from "../../middlewares/validateReq";
class SignIn implements __Router {
  path = "/users/signin";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
          .trim()
          .isLength({ min: 6, max: 255 })
          .withMessage("Password must be at least 6 chars long and 255 max"),
      ],
      validatereq,
      userController.signIn_user
    );
  }
}

export default SignIn;
```

The controller on the other hand have interesting part lets see it:

```jsx
public async signIn_user(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      //if user does not exist
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadReqErr("invalid creds can not find user ");
      }
      //check password
      const validate = comparePass(password, existingUser.password);
      if (!validate) {
        throw new BadReqErr("invalid creds  error in password");
      }
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        process.env.JWT_KEY!,
        { expiresIn: "1d" }
      );
      req.session = {
        jwt: token,
      };
      res.status(200).send({
        name: existingUser.name,
        email: existingUser.email,
        token,
        status: true,
        msg: "Done Signing In.",
      });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
```

When the user sign in it will generate a token this token is important because it will be used later to authenticate the user.

### Sign Out

Its very simple get request that removes the token so user is no longer have access to protected routes.

```jsx
 public async signout(req: Request, res: Response) {
    req.session = null;
    res.send({
      token: null,
      currentUser: null,
    });
  }
```

### Current User

This route is used to authenticate user on the front end upon trying to access protected page on the front end.

```jsx
import { Router } from "express";
import __Router from "../../types/routerType";
import { userController } from "../../controllers/userController/user";
import { Auth } from "../../middlewares/auth";
class CurrentUser implements __Router {
  path = "/users/current_user";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, Auth, userController.current);
  }
}

export default CurrentUser;

```

There is A middleware before the controller its called Auth lets see the code example for it:

```jsx
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuth } from "../error_classes/notAuthError";
import { userPayload, currRequest } from "../types/generalTypes";
export const Auth = async (
  req: currRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authentication || req.body.authentication) {
    try {
      const authentication = req.headers.authentication
        ? req.headers.authentication
        : req.body.authentication;
      const payload = jwt.verify(
        authentication,
        process.env.JWT_KEY!
      ) as userPayload;
      req.currentUser = payload;
    } catch (err) {
      return next(new NotAuth("You are not authenticated"));
    }

    return next();
  }
  if (!req.session?.jwt) {
    return next(new NotAuth("You are not authenticated"));
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as userPayload;
    req.currentUser = payload;
  } catch (err) {
    return next(new NotAuth("You are not authenticated"));
  }

  return next();
};
```

When the request came this function will check the headers for authentication and try to authenticate user if the user have valid token then i will add the payload and just proceed to the next middleware which is current controller if the user does not have valid token then I return an error this error will be triggered by another middleware its called handleError lets see what it looks like:

```jsx
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../error_classes/customError";
export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send(err.summary());
  } else {
    res.status(400).send([{ message: err.message }]);
  }
};
```

This function will return a customized error so it can be handled properly on the front end.

Lets see now the controller of the current user its simple it return the user if exist.

```jsx
public async current(req: currRequest, res: Response) {
    if (req.currentUser) {
      try {
        const user = await User.findById(req.currentUser.id);
        if (user) {
          const { name, email, _id } = user;
          res.send({
            name,
            email,
            id: _id,
            status: true,
          });
        } else {
          throw new NotFound("this user can not be found");
        }
      } catch (err: any) {
        throw new BadReqErr(err.message);
      }
    } else {
      res.send({ currentUser: null });
    }
  }
```

---

# Tasks

## Frontend

Pages thats handle tasks are one page I decided to put all the design in place to not distract you and life become much easier.

lets see what the tasks page looks like i already have tasks on my account but with your account the tasks does not exist so start add new ones.

![image.png](todo_readme_imgs/image%203.png)

In the above image we have Boxes the corresponds to every feature for our tasks page lets discuss them in great detail:

1. Red Box
2. black Box
3. Blue Box
4. Yellow box
5. purple Box
6. Orange Box

### Red Box

In this box i displayed a welcome text to the signed in user.

### Black Box

This box is special because you can enter a text and it will display an auto complete for you for example if start typing `pl` it will show you all the tasks that start with `pl`:

![image.png](todo_readme_imgs/image%204.png)

And if you clicked `play football` it will give you all the tasks that have football as content:

![image.png](todo_readme_imgs/image%205.png)

Another feature which is filter by status:

![image.png](todo_readme_imgs/image%206.png)

If you want for example get all tasks that have `done` status you can just click `done` and magic will happen see this image:

![image.png](todo_readme_imgs/image%207.png)

You can also combine text with filter meaning you can get all tasks that have play football
and also have done as status:

![image.png](todo_readme_imgs/image%208.png)

### Blue Box

This box responsible for creating tasks Just type into it and press enter or click Add Task button.

### Yellow Box

We have four parts on this section

- Tasks
  Which is the task name
- Status
  The status of the task either `not started` , `pending` or `done`.
- Edit
  Its a button to edit the task if you press it this will open two inputs for tasks and status lets an Image:
  ![image.png](todo_readme_imgs/image%209.png)

      You can change the content for example change it to be play football with friends or change the status of it.

- Delete
  If you pressed this button this will raise a popup thats tells you if you wants to delete the task or not lets see an image:
  ![image.png](todo_readme_imgs/image%2010.png)

### Purple Box

Its a pagination where you can enter the page that you want each page gives you only 5 tasks.

### Orange Box

Its a sign out button if you pressed this will re direct you to the sign in page.

---

## Backend

I have implemented 5 features on the backend and they are :

1. create task
2. edit task
3. delete task
4. search tasks
5. auto complete tasks

### Create Task

Its simply create the the task and add it to the user lets see route:

```jsx
import { Router } from "express";
import __Router from "../../types/routerType";
import { body } from "express-validator";
import { taskController } from "../../controllers/taskController/task";
import { validatereq } from "../../middlewares/validateReq";
import { Auth } from "../../middlewares/auth";
class CreateTask implements __Router {
  path = "/tasks/create_task";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      [
        body("content")
          .exists()
          .withMessage("content is required")
          .bail()
          .isString()
          .withMessage("content must be string")
          .bail()
          .isLength({ min: 1 })
          .withMessage("content must be at least 1 chars long"),
      ],
      validatereq,
      Auth,
      taskController.create_task
    );
  }
}

export default CreateTask;
```

In the above example code it checks the content first then checks if the user have valid token or not by using Auth middleware then go to the controller lets view the controller:

```jsx
 public async create_task(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      user.tasks.push(req.body);
      await user.save();
      res.status(201).send({
        status: true,
        task: user.tasks[user.tasks.length - 1],
        tasks: user.tasks.slice(5),
        arrSize: user.tasks.length,
      });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
```

This controller checks the user exist or not and the task to this user.

### Edit Task

Its a patch request that it can be used to edit content or status or both:

```jsx
import { Router } from "express";
import __Router from "../../types/routerType";
import { body } from "express-validator";
import { taskController } from "../../controllers/taskController/task";
import { validatereq } from "../../middlewares/validateReq";
import { Auth } from "../../middlewares/auth";
class UpdateContentTask implements __Router {
  path = "/tasks/update_content_task";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }
  private checkStatus(value: string) {
    const allowedStatuses = ["not-started", "in-progress", "done"];
    if (!allowedStatuses.includes(value)) {
      throw new Error(
        "Status must be one of the following: not-started, in-progress, done"
      );
    }
    return true;
  }
  private initializeRoutes(): void {
    this.router.patch(
      `${this.path}`,
      [
        body("content")
          .optional()
          .isString()
          .withMessage("content must be string")
          .bail()
          .isLength({ min: 1 })
          .withMessage("content must be at least 1 chars long"),
        body("taskId")
          .isMongoId()
          .withMessage("taskId must be valid mongodb id."),
        body("status")
          .optional()
          .isString()
          .withMessage("status must be string")
          .bail()
          .custom(this.checkStatus),
      ],
      validatereq,
      Auth,
      taskController.update_task
    );
  }
}

export default UpdateContentTask;
```

In the above route we check if the content is provided then apply validations to it same works status but taskId must be provided

lets see the controller:

```jsx
public async update_task(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { taskId, content, status } = req.body;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      let updatedTask;
      let found = false;
      for (let i = 0; i < user.tasks.length; i++) {
        let singleTask = user.tasks[i];
        if (singleTask._id.toString() === taskId) {
          found = true;
          singleTask.content = content ? content : singleTask.content;
          singleTask.status = status ? status : singleTask.status;
          updatedTask = singleTask;
          await user.save();
          break;
        }
      }
      if (!found) {
        throw new NotFound("Can not find the task please try again!");
      }
      res.status(200).send({
        status: true,
        updatedTask: updatedTask ? updatedTask : "The task is not updated!",
      });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
```

This function will take content if exist and replace the old this flow also happen with status.

### Delete Task

The route is responsible for deleting the tasks lets see the code example:

```jsx
 import { Router } from "express";
import __Router from "../../types/routerType";
import { body } from "express-validator";
import { taskController } from "../../controllers/taskController/task";
import { validatereq } from "../../middlewares/validateReq";
import { Auth } from "../../middlewares/auth";
class DeleteTask implements __Router {
  path = "/tasks/delete_task";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      [
        body("taskId")
          .isMongoId()
          .withMessage("taskId must be valid mongodb id."),
      ],
      validatereq,
      Auth,
      taskController.delete_task
    );
  }
}

export default DeleteTask;
```

its simply check for task id and if the user have valid token or not and then run the controller if all the middlewares runs fine.

lets see the controller:

```jsx
public async delete_task(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { taskId } = req.body;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      const newTasks = user.tasks.filter((task) => {
        if (taskId !== task._id.toString()) {
          return task;
        }
      });
      user.tasks = newTasks;
      await user.save();
      res.status(200).send({
        status: true,
        tasks: newTasks,
        arrSize: newTasks.length,
      });
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
```

the controller return the new tasks that does not hold the task the you deleted.

### Search Tasks

This route handle the search for tasks its simply checks the content and status and page we need those data to search for the tasks:

```jsx
import { Router } from "express";
import __Router from "../../types/routerType";
import { body } from "express-validator";
import { taskController } from "../../controllers/taskController/task";
import { validatereq } from "../../middlewares/validateReq";
import { Auth } from "../../middlewares/auth";
class FullTextTask implements __Router {
  path = "/tasks/full_text_content";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }
  private checkStatus(value: string) {
    const allowedStatuses = ["not-started", "in-progress", "done", "all"];
    if (!allowedStatuses.includes(value)) {
      throw new Error(
        "Status for filter must be one of the following: not-started, in-progress, done, all"
      );
    }
    return true;
  }
  private checkPage(value: any) {
    if (typeof value !== "number") {
      throw new Error("Page must be valid number.");
    }
    return true;
  }
  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      [
        body("content")
          .optional()
          .isString()
          .withMessage("content must be string")
          .bail()
          .isLength({ min: 1 })
          .withMessage("content must be at least 1 chars long"),
        body("status")
          .optional()
          .isString()
          .withMessage("status must be string")
          .bail()
          .custom(this.checkStatus),
        body("page")
          .exists()
          .withMessage("page must exist")
          .custom(this.checkPage),
      ],
      validatereq,
      Auth,
      taskController.full_text_search
    );
  }
}

export default FullTextTask;
```

lets see the controller to give us lear understanding of what is happening:

```jsx
public async full_text_search(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { content, page, status } = req.body;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      if (!content) {
        if (status === "all" || !status) {
          const arrSize = user.tasks.length;
          const tasks = paginateArray(user.tasks, page);
          res.status(200).send({ status: true, tasks, arrSize });
        } else {
          const tasks = user.tasks.filter((task) => {
            if (task.status === status) {
              return task;
            }
          });
          const arrSize = tasks.length;
          const paginatedTasks = paginateArray(tasks, page);
          res
            .status(200)
            .send({ status: true, tasks: paginatedTasks, arrSize });
        }
      } else {
        const pipeline = [
          {
            $search: {
              index: "taskIndex",
              compound: {
                must: [
                  {
                    equals: {
                      value: new mongoose.Types.ObjectId(id),
                      path: "_id",
                    },
                  },
                  {
                    equals: {
                      value: content,
                      path: "tasks.content",
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              tasks: {
                $filter: {
                  input: "$tasks",
                  as: "task",
                  cond: { $eq: ["$$task.content", content] },
                },
              },
            },
          },
        ];
        const result = await User.aggregate<UserRes>(pipeline);
        let tasksReturned: TaskRes[] | [] = [];
        if (result.length > 0) {
          tasksReturned = result[0].tasks;
        }
        if (
          status &&
          (status === "done" ||
            status === "in-progress" ||
            status === "not-started")
        ) {
          tasksReturned = tasksReturned.filter((task) => {
            if (task.status === status) {
              return task;
            }
          });
          const arrSize = tasksReturned.length;
          const tasks = paginateArray(tasksReturned, page);

          res.send({ status: true, tasks, arrSize });
        }
        if (!status || status === "all") {
          const arrSize = tasksReturned.length;
          const tasks = paginateArray(tasksReturned, page);
          res.send({ status: true, tasks, arrSize });
        }
      }
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
```

Will i know this maybe looks complex but what this controller does is if there is no content provided meaning if the user just refresh the page this will trigger calling this function and the content will be null also the status then we need to get all the tasks of the user slice the first 5 records page by the way will be one on every refresh i handle this in the front side then what will happen is return the data to the user.

But if the content is provided we will use an atlas search feature from mongoDB to search to get the tasks with the content we provided also if the status is provided this will filter the tasks to the status that is provided.

### Auto Complete Tasks

This route is responsible for handling the auto complete for the text lets see the code example:

```jsx
import { Router } from "express";
import __Router from "../../types/routerType";
import { body } from "express-validator";
import { taskController } from "../../controllers/taskController/task";
import { validatereq } from "../../middlewares/validateReq";
import { Auth } from "../../middlewares/auth";
class AutoCompleteTask implements __Router {
  path = "/tasks/autocomplete_content";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      [
        body("content")
          .optional()
          .isString()
          .withMessage("content must be string")
          .bail()
          .isLength({ min: 1 })
          .withMessage("content must be at least 1 chars long"),
      ],
      validatereq,
      Auth,
      taskController.autocomplete_content
    );
  }
}

export default AutoCompleteTask;
```

Its simple route it just check if the content exist apply the validations to it

Now lets see the controller:

```jsx
public async autocomplete_content(req: currRequest, res: Response) {
    try {
      const { id } = req.currentUser!;
      const { content } = req.body;
      const user = await User.findById(id);
      if (!user) {
        throw new NotFound("Can not find the user!");
      }
      if (!content) {
        res.status(200).send({ status: true, tasks: [] });
      } else {
        const mustDocs = [
          {
            equals: {
              value: new mongoose.Types.ObjectId(id),
              path: "_id",
            },
          },
          {
            autocomplete: {
              path: "tasks.content",
              tokenOrder: "sequential",
              query: content,
            },
          },
        ];
        const pipeline = [
          {
            $search: {
              index: "taskIndex",
              compound: {
                must: mustDocs,
              },
              highlight: {
                path: "tasks.content",
              },
            },
          },
          {
            $project: {
              highlights: {
                $meta: "searchHighlights",
              },
            },
          },
        ];
        const highlights = await User.aggregate(pipeline);
        let results = [];
        if (highlights.length > 0) {
          const highlightsArr = highlights[0].highlights;
          if (highlightsArr.length > 0) {
            for (let i = 0; i < highlightsArr.length; i++) {
              let highlight_element: text = highlightsArr[i];
              let concatArray = highlight_element.texts
                .map((elem) => elem.value)
                .join("");
              results.push(concatArray);
            }
          }
        }
        results = [...new Set(results)];
        res.status(200).send({ status: true, tasks: results });
      }
    } catch (error: any) {
      throw new BadReqErr(error.message);
    }
  }
```

In this controller if the content does not exist return empty array but if it exist then what will happen is in the search operator i used compound to check for two things the id of the user and the auto complete and this works because i created taskIndex and indexed the content field with autocomplete then after that i customized the data and return it to the user.

---
