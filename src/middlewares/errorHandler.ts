import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { QueryFailedError } from "typeorm";

const errorHandlerMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  if (err.isJoi === true) {
    err = createError.BadRequest(err.message);
  } else if (err instanceof QueryFailedError && err["code"] === "23505") {
    err = createError.Conflict('This record already exists');
  }

  const message =
    err instanceof createError.HttpError ? err.message : "Something went wrong. Please try again later.";

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message,
  });
};

export default errorHandlerMiddleware;
