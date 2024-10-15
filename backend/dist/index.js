"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
const envPath = (0, path_1.resolve)("./src/.env");
dotenv.config({ path: envPath });
const app_1 = __importDefault(require("./app"));
const createUser_1 = __importDefault(require("./routes/users/createUser"));
const signInUser_1 = __importDefault(require("./routes/users/signInUser"));
const currentUser_1 = __importDefault(require("./routes/users/currentUser"));
const signoutUser_1 = __importDefault(require("./routes/users/signoutUser"));
const createTask_1 = __importDefault(require("./routes/tasks/createTask"));
const updateContentTask_1 = __importDefault(require("./routes/tasks/updateContentTask"));
const deleteTask_1 = __importDefault(require("./routes/tasks/deleteTask"));
const autoCompleteTask_1 = __importDefault(require("./routes/tasks/autoCompleteTask"));
const fullTextSearch_1 = __importDefault(require("./routes/tasks/fullTextSearch"));
const statusFilterTask_1 = __importDefault(require("./routes/tasks/statusFilterTask"));
new app_1.default([
    //Users
    new createUser_1.default(),
    new signInUser_1.default(),
    new currentUser_1.default(),
    new signoutUser_1.default(),
    //Tasks
    new createTask_1.default(),
    new updateContentTask_1.default(),
    new deleteTask_1.default(),
    new autoCompleteTask_1.default(),
    new fullTextSearch_1.default(),
    new statusFilterTask_1.default(),
], parseInt(process.env.PORT));
