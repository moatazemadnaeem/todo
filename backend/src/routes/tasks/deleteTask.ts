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
