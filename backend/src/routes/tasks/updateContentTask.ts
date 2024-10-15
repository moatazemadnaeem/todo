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
