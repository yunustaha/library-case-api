import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

const errorHandlerMiddleware = async (
  err : any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  if (err.isJoi === true) {
    err = createError.BadRequest(err.message);
  }

  const status = err.status || 500;
  res.status(status).json({
    status: status,
    success: false,
    message: err.message,
  });
};

export default errorHandlerMiddleware;
