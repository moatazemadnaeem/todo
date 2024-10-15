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
