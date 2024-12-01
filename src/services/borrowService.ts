import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Borrow } from "../entity/Borrow";
import createError from "http-errors";
class BorrowService {
  private borrowRepository: Repository<Borrow>;

  constructor() {
    this.borrowRepository = AppDataSource.getRepository(Borrow);
  }

  fetchNotReturnedBorrowWithBook = async (
    bookId: string
  ): Promise<{ borrow: Borrow; error?: Error }> => {
    const borrow = await this.borrowRepository.findOne({
      where: {
        book: { id: parseInt(bookId) },
        returnDate: IsNull(),
      },
    });

    return { borrow };
  };

  insertBorrowRecordForUser = async (
    userId: string,
    bookId: string
  ): Promise<{ borrow: Borrow; error?: Error }> => {
    const existingRecord = await this.borrowRepository.findOne({
      where: {
        user: { id: parseInt(userId) },
        book: { id: parseInt(bookId) },
      },
    });

    if (existingRecord) {
      if (!existingRecord.returnDate) {
        return {
          borrow: existingRecord,
          error: createError.Conflict(
            "This user has already borrowed this book"
          ),
        };
      } else {
        return {
          borrow: existingRecord,
          error: createError.Conflict(
            "This book has already been borrowed and returned, and it cannot be borrowed again."
          ),
        };
      }
    }

    const newBorrow = this.borrowRepository.create({
      book: {
        id: parseInt(bookId),
      },
      borrowDate: new Date(),
      user: {
        id: parseInt(userId),
      },
    });

    const borrow = await this.borrowRepository.save(newBorrow);

    return { borrow };
  };

  updateReturnForUserBorrow = async (
    userId: string,
    bookId: string,
    score: number
  ): Promise<{ borrow: Borrow; error?: Error }> => {
    const borrow = await this.borrowRepository.findOne({
      where: {
        user: { id: parseInt(userId) },
        book: { id: parseInt(bookId) },
        returnDate: IsNull(),
      },
    });

    if (!borrow) {
      return {
        borrow,
        error: createError.NotFound(
          "Borrow record not found or already returned"
        ),
      };
    }

    borrow.returnDate = new Date();
    borrow.score = score;

    await this.borrowRepository.save(borrow);

    return { borrow };
  };
}
export default new BorrowService();
