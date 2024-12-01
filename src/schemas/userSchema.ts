import Joi from "joi";

const postUser = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).max(100).required().label("name"),
  }).required(),
});

const getUser = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().label("id"),
  }).required(),
});

const addBorrowRecordForUser = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().label("id"),
    bookId: Joi.number().integer().positive().required().label("bookId"),
  }).required(),
});

const addReturnForUserBorrow = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().label("id"),
    bookId: Joi.number().integer().positive().required().label("bookId"),
  }).required(),
  body: Joi.object({
    score: Joi.number()
      .integer()
      .positive()
      .min(1)
      .max(10)
      .required()
      .label("score"),
  }).required(),
});

const userSchema = {
  postUser,
  getUser,
  addBorrowRecordForUser,
  addReturnForUserBorrow,
};

export default userSchema;
