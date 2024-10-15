"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const badReqError_1 = require("../../error_classes/badReqError");
const notFoundError_1 = require("../../error_classes/notFoundError");
const mongoose_1 = __importDefault(require("mongoose"));
const paginate_1 = require("../../utils/paginate");
class TaskController {
    create_task(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.currentUser;
                const user = yield userModel_1.default.findById(id);
                if (!user) {
                    throw new notFoundError_1.NotFound("Can not find the user!");
                }
                user.tasks.push(req.body);
                yield user.save();
                res.status(201).send({
                    status: true,
                    task: user.tasks[user.tasks.length - 1],
                    arrSize: user.tasks.length,
                });
            }
            catch (error) {
                throw new badReqError_1.BadReqErr(error.message);
            }
        });
    }
    update_task(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.currentUser;
                const { taskId, content, status } = req.body;
                const user = yield userModel_1.default.findById(id);
                if (!user) {
                    throw new notFoundError_1.NotFound("Can not find the user!");
                }
                let updatedTask;
                let found = false;
                for (let i = 0; i < user.tasks.length; i++) {
                    let singleTask = user.tasks[i];
                    if (singleTask._id.toString() === taskId) {
                        found = true;
                        singleTask.content = content ? content : singleTask.content;
                        singleTask.status = status ? status : singleTask.status;
                        updatedTask = singleTask;
                        yield user.save();
                        break;
                    }
                }
                if (!found) {
                    throw new notFoundError_1.NotFound("Can not find the task please try again!");
                }
                res.status(200).send({
                    status: true,
                    updatedTask: updatedTask ? updatedTask : "The task is not updated!",
                });
            }
            catch (error) {
                throw new badReqError_1.BadReqErr(error.message);
            }
        });
    }
    delete_task(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.currentUser;
                const { taskId } = req.body;
                const user = yield userModel_1.default.findById(id);
                if (!user) {
                    throw new notFoundError_1.NotFound("Can not find the user!");
                }
                const newTasks = user.tasks.filter((task) => {
                    if (taskId !== task._id.toString()) {
                        return task;
                    }
                });
                user.tasks = newTasks;
                yield user.save();
                res.status(200).send({
                    status: true,
                    tasks: newTasks,
                    arrSize: newTasks.length,
                });
            }
            catch (error) {
                throw new badReqError_1.BadReqErr(error.message);
            }
        });
    }
    autocomplete_content(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.currentUser;
                const { content } = req.body;
                const user = yield userModel_1.default.findById(id);
                if (!user) {
                    throw new notFoundError_1.NotFound("Can not find the user!");
                }
                if (!content) {
                    res.status(200).send({ status: true, tasks: [] });
                }
                else {
                    const mustDocs = [
                        {
                            equals: {
                                value: new mongoose_1.default.Types.ObjectId(id),
                                path: "_id",
                            },
                        },
                        {
                            autocomplete: {
                                path: "tasks.content",
                                tokenOrder: "sequential",
                                query: content,
                            },
                        },
                    ];
                    const pipeline = [
                        {
                            $search: {
                                index: "taskIndex",
                                compound: {
                                    must: mustDocs,
                                },
                                highlight: {
                                    path: "tasks.content",
                                },
                            },
                        },
                        {
                            $project: {
                                highlights: {
                                    $meta: "searchHighlights",
                                },
                            },
                        },
                    ];
                    const highlights = yield userModel_1.default.aggregate(pipeline);
                    let results = [];
                    if (highlights.length > 0) {
                        const highlightsArr = highlights[0].highlights;
                        if (highlightsArr.length > 0) {
                            for (let i = 0; i < highlightsArr.length; i++) {
                                let highlight_element = highlightsArr[i];
                                let concatArray = highlight_element.texts
                                    .map((elem) => elem.value)
                                    .join("");
                                results.push(concatArray);
                            }
                        }
                    }
                    results = [...new Set(results)];
                    res.status(200).send({ status: true, tasks: results });
                }
            }
            catch (error) {
                throw new badReqError_1.BadReqErr(error.message);
            }
        });
    }
    full_text_search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.currentUser;
                const { content, page } = req.body;
                const user = yield userModel_1.default.findById(id);
                if (!user) {
                    throw new notFoundError_1.NotFound("Can not find the user!");
                }
                if (!content) {
                    const arrSize = user.tasks.length;
                    const tasks = (0, paginate_1.paginateArray)(user.tasks, page);
                    res.status(200).send({ status: true, tasks, arrSize });
                }
                else {
                    const pipeline = [
                        {
                            $search: {
                                index: "taskIndex",
                                compound: {
                                    must: [
                                        {
                                            equals: {
                                                value: new mongoose_1.default.Types.ObjectId(id),
                                                path: "_id",
                                            },
                                        },
                                        {
                                            equals: {
                                                value: content,
                                                path: "tasks.content",
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                tasks: {
                                    $filter: {
                                        input: "$tasks",
                                        as: "task",
                                        cond: { $eq: ["$$task.content", content] },
                                    },
                                },
                            },
                        },
                    ];
                    const result = yield userModel_1.default.aggregate(pipeline);
                    let tasksReturned = [];
                    if (result.length > 0) {
                        tasksReturned = result[0].tasks;
                    }
                    const arrSize = tasksReturned.length;
                    const tasks = (0, paginate_1.paginateArray)(tasksReturned, page);
                    res.send({ status: true, tasks, arrSize });
                }
            }
            catch (error) {
                throw new badReqError_1.BadReqErr(error.message);
            }
        });
    }
    tasks_by_status(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.currentUser;
                const { status } = req.body;
                const user = yield userModel_1.default.findById(id);
                if (!user) {
                    throw new notFoundError_1.NotFound("Can not find the user!");
                }
                const tasks = user.tasks.filter((task) => {
                    if (task.status === status) {
                        return task;
                    }
                });
                res.send({ status: true, tasks });
            }
            catch (error) {
                throw new badReqError_1.BadReqErr(error.message);
            }
        });
    }
}
exports.taskController = new TaskController();
//# sourceMappingURL=task.js.map