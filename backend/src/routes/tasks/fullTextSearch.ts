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
