import { Router } from "express";
import __Router from "../../types/routerType";
import { body } from "express-validator";
import { taskController } from "../../controllers/taskController/task";
import { validatereq } from "../../middlewares/validateReq";
import { Auth } from "../../middlewares/auth";
class StatusFilterTask implements __Router {
  path = "/tasks/status_filter_task";
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
    this.router.post(
      `${this.path}`,
      [
        body("status")
          .exists()
          .withMessage("status is required")
          .bail()
          .isString()
          .withMessage("status must be string")
          .bail()
          .custom(this.checkStatus),
      ],
      validatereq,
      Auth,
      taskController.tasks_by_status
    );
  }
}

export default StatusFilterTask;
