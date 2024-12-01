import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

const validationHandler = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req, { allowUnknown: true });

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validationHandler;
