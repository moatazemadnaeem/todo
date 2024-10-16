import { Request } from "express";
export interface userPayload {
  id: string;
}
export interface currRequest extends Request {
  currentUser?: userPayload;
}
export interface text {
  score: number;
  path: string;
  texts: [{ value: string; hit: string }];
}
export enum StatusEnum {
  NOT_STARTED = "not-started",
  IN_PROGRESS = "in-progress",
  DONE = "done",
  ALL = "all",
}
