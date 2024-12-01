import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import createError from "http-errors";

const fetchBooks = async () => {
  const bookRepository = AppDataSource.getRepository(Book);

  const data = await bookRepository.find({
    select: {
      id: true,
      name: true,
    },
  });

  return data;
};

const fetchBook = async (bookId: string, notFoundError = false) => {
  const bookRepository = AppDataSource.getRepository(Book);

  const data = await bookRepository.findOne({
    where: { id: parseInt(bookId) },
    select: { id: true, name: true },
  });

  if (!data && notFoundError) {
    throw createError.NotFound("Book not found");
  }

  return data;
};

const fetchBookWithScore = async (bookId: string) => {
  const bookRepository = AppDataSource.getRepository(Book);

  const data = await bookRepository
    .createQueryBuilder("book")
    .leftJoinAndSelect("book.borrows", "borrow")
    .select("book.id", "id")
    .addSelect("book.name", "name")
    .addSelect("COALESCE(AVG(borrow.score), -1)", "score")
    .where("book.id = :bookId", { bookId })
    .groupBy("book.id")
    .getRawOne();

  return data;
};

const insertBook = async (name: string) => {
  const bookRepository = AppDataSource.getRepository(Book);

  const newBook = bookRepository.create({
    name,
  });

  const data = await bookRepository.save(newBook);

  return data;
};

const bookService = {
  fetchBooks,
  fetchBook,
  fetchBookWithScore,
  insertBook,
};

export default bookService;
