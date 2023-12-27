import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { handleResponseError } from "../utils/handleResponse";

// ---------------- Not found ----------------
export const notFound = (req: Request, res: Response, next: NextFunction) : void => {
  const error: Error = new Error("Not Found");
  res.status(404).send('Not Found');
  next(error);
};

// ---------------- Error handler ----------------
export const errorHandler = (err: Error, req: Request, res: Response) : void => {
  const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
  const errorMessage: string = err.message || "Internal Server Error";
  handleResponseError(res, statusCode, errorMessage);
  return;
};