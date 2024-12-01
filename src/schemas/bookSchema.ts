import Joi from "joi";

const postBook = Joi.object({
  name: Joi.string().min(3).max(100).required(),
});

const getBook = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const bookSchema = {
  postBook,
  getBook,
};

export default bookSchema;
