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
    initializeRoutes() {
        this.router.patch(`${this.path}`, [
            (0, express_validator_1.body)("content")
                .exists()
                .withMessage("content is required")
                .bail()
                .isLength({ min: 1 })
                .withMessage("content must be at least 1 chars long"),
        ], validateReq_1.validatereq, auth_1.Auth, task_1.taskController.update_content_task);
    }
}
exports.default = UpdateContentTask;
