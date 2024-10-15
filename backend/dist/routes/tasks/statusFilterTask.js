"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const task_1 = require("../../controllers/taskController/task");
const validateReq_1 = require("../../middlewares/validateReq");
const auth_1 = require("../../middlewares/auth");
class StatusFilterTask {
    constructor() {
        this.path = "/tasks/status_filter_task";
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
        this.router.post(`${this.path}`, [
            (0, express_validator_1.body)("status")
                .exists()
                .withMessage("status is required")
                .bail()
                .isString()
                .withMessage("status must be string")
                .bail()
                .custom(this.checkStatus),
        ], validateReq_1.validatereq, auth_1.Auth, task_1.taskController.tasks_by_status);
    }
}
exports.default = StatusFilterTask;
//# sourceMappingURL=statusFilterTask.js.map