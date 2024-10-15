"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const task_1 = require("../../controllers/taskController/task");
const validateReq_1 = require("../../middlewares/validateReq");
const auth_1 = require("../../middlewares/auth");
class AutoCompleteTask {
    constructor() {
        this.path = "/tasks/autocomplete_content";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, [
            (0, express_validator_1.body)("content")
                .optional()
                .isString()
                .withMessage("content must be string")
                .bail()
                .isLength({ min: 1 })
                .withMessage("content must be at least 1 chars long"),
        ], validateReq_1.validatereq, auth_1.Auth, task_1.taskController.autocomplete_content);
    }
}
exports.default = AutoCompleteTask;
