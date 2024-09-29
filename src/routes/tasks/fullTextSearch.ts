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
  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      [
        body("content")
          .exists()
          .withMessage("content is required")
          .bail()
          .isString()
          .withMessage("content must be string"),
      ],
      validatereq,
      Auth,
      taskController.full_text_search
    );
  }
}

export default FullTextTask;
