import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import createError from "http-errors";
import { Repository } from "typeorm";

class BookService {
  private bookRepository: Repository<Book>;

  constructor() {
    this.bookRepository = AppDataSource.getRepository(Book);
  }

  async fetchBooks() {
    const books = await this.bookRepository.find({
      select: {
        id: true,
        name: true,
      },
    });

    return { books };
  }

  async fetchBook(bookId: string): Promise<{ book: Book; error?: Error }> {
    const book = await this.bookRepository.findOne({
      where: { id: parseInt(bookId) },
      select: { id: true, name: true },
    });

    if (!book) {
      return { book, error: createError.NotFound("Book not found") };
    }

    return { book };
  }

  async fetchBookWithScore(
    bookId: string
  ): Promise<{ data: any; error?: Error }> {
    const data = await this.bookRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.borrows", "borrow")
      .select("book.id", "id")
      .addSelect("book.name", "name")
      .addSelect("COALESCE(ROUND(AVG(borrow.score), 2), -1)", "score")
      .where("book.id = :bookId", { bookId })
      .groupBy("book.id")
      .getRawOne();

    if (!data) {
      return { data, error: createError.NotFound("Book not found") };
    }

    return { data };
  }

  async insertBook(name: string) {
    const newBook = this.bookRepository.create({ name });

    const book = await this.bookRepository.save(newBook);

    return { book };
  }
}

export default new BookService();
