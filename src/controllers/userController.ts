import { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import bookService from "../services/bookService";
import borrowService from "../services/borrowService";

class UserController {
  postUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        body: { name },
      } = req;

      const { user } = await userService.insertUser(name);

      res.status(201).json({ success: true, insertId: user.id });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { users } = await userService.fetchUsers();

      res.send(users);
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        params: { id },
      } = req;

      const { data, error } = await userService.fetchUserWithBorrows(id);

      if (error) {
        next(error);
        return;
      }

      res.send(data);
    } catch (error) {
      next(error);
    }
  };

  addBorrowRecordForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        params: { id, bookId },
      } = req;

      const { error: userError } = await userService.fetchUser(id);

      if (userError) {
        next(userError);
        return;
      }

      const { error: bookError } = await bookService.fetchBook(bookId);

      if (bookError) {
        next(bookError);
        return;
      }

      const { borrow, error: borrowError } =
        await borrowService.insertBorrowRecordForUser(id, bookId);

      if (borrowError) {
        next(borrowError);
        return;
      }

      res.status(201).json({ success: true, insertId: borrow.id });
    } catch (error) {
      next(error);
    }
  };

  addReturnForUserBorrow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        params: { id, bookId },
        body: { score },
      } = req;

      const { error: userError } = await userService.fetchUser(id);

      if (userError) {
        next(userError);
        return;
      }

      const { error: bookError } = await bookService.fetchBook(bookId);

      if (bookError) {
        next(bookError);
        return;
      }

      const { error: borrowError } =
        await borrowService.updateReturnForUserBorrow(id, bookId, score);

      if (borrowError) {
        next(borrowError);
        return;
      }

      res.send({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
export default new UserController();
