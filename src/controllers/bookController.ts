import { NextFunction, Request, Response } from "express";
import bookService from "../services/bookService";

class BookController {
  postBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        body: { name },
      } = req;

      const { book } = await bookService.insertBook(name);

      res.status(201).json({ success: true, insertId: book.id });
    } catch (error) {
      next(error);
    }
  };

  getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { books } = await bookService.fetchBooks();

      res.send(books);
    } catch (error) {
      next(error);
    }
  };

  getBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        params: { id },
      } = req;

      const { data, error } = await bookService.fetchBookWithScore(id);

      if (error) {
        next(error);
        return;
      }

      res.send(data);
    } catch (error) {
      next(error);
    }
  };
}

export default new BookController();
