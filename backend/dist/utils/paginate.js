"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateArray = void 0;
const paginateArray = (array, page) => {
    const start = (page - 1) * 5;
    const end = start + 5;
    return array.slice(start, end);
};
exports.paginateArray = paginateArray;
