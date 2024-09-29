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
