"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const task_1 = require("../../controllers/taskController/task");
const validateReq_1 = require("../../middlewares/validateReq");
const auth_1 = require("../../middlewares/auth");
class DeleteTask {
    constructor() {
        this.path = "/tasks/delete_task";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, [
            (0, express_validator_1.body)("taskId")
                .isMongoId()
                .withMessage("taskId must be valid mongodb id."),
        ], validateReq_1.validatereq, auth_1.Auth, task_1.taskController.delete_task);
    }
}
exports.default = DeleteTask;
//# sourceMappingURL=deleteTask.js.map