"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const task = new mongoose_1.default.Schema({
    status: {
        type: String,
        default: "not-started",
        enum: ["done", "in-progress", "not-started"],
    },
    content: {
        type: String,
        required: true,
    },
});
exports.default = task;
//# sourceMappingURL=taskModel.js.map