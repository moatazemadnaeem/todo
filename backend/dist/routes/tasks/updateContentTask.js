"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const task_1 = require("../../controllers/taskController/task");
const validateReq_1 = require("../../middlewares/validateReq");
const auth_1 = require("../../middlewares/auth");
class UpdateContentTask {
    constructor() {
        this.path = "/tasks/update_content_task";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    checkStatus(value) {
        const allowedStatuses = ["not-started", "in-progress", "done"];
        if (!allowedStatuses.includes(value)) {
            throw new Error("Status must be one of the following: not-started, in-progress, done");
        }
        return true;
    }
    initializeRoutes() {
        this.router.patch(`${this.path}`, [
            (0, express_validator_1.body)("content")
                .optional()
                .isString()
                .withMessage("content must be string")
                .bail()
                .isLength({ min: 1 })
                .withMessage("content must be at least 1 chars long"),
            (0, express_validator_1.body)("taskId")
                .isMongoId()
                .withMessage("taskId must be valid mongodb id."),
            (0, express_validator_1.body)("status")
                .optional()
                .isString()
                .withMessage("status must be string")
                .bail()
                .custom(this.checkStatus),
        ], validateReq_1.validatereq, auth_1.Auth, task_1.taskController.update_task);
    }
}
exports.default = UpdateContentTask;
//# sourceMappingURL=updateContentTask.js.map