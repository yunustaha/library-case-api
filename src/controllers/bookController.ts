import { NextFunction, Request, Response } from "express";
import bookService from "../services/bookService";
import bookSchema from "../schemas/bookSchema";

const postBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body: { name },
    } = req;

    await bookSchema.postBook.validateAsync({ name });

    const data = await bookService.insertBook(name);

    res.send({ success: true, insertId: data.id });
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bookService.fetchBooks();

    res.send(data);
  } catch (error) {
    next(error);
  }
};

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      params: { id },
    } = req;

    await bookSchema.getBook.validateAsync({ id });

    const data = await bookService.fetchBookWithScore(id);

    res.send(data);
  } catch (error) {
    next(error);
  }
};

const bookController = {
  postBook,
  getBooks,
  getBook,
};

export default bookController;
