import { IsNull } from "typeorm";
import { AppDataSource } from "../data-source";
import { Borrow } from "../entity/Borrow";
import createError from "http-errors";

const insertBorrowRecordForUser = async (
  userId: string,
  bookId: string
): Promise<{ borrow: Borrow; error?: Error }> => {
  const borrowRepository = AppDataSource.getRepository(Borrow);

  const existingRecord = await borrowRepository.findOne({
    where: {
      user: { id: parseInt(userId) },
      book: { id: parseInt(bookId) },
    },
  });

  if (existingRecord) {
    if (!existingRecord.returnDate) {
      return {
        borrow: existingRecord,
        error: createError.BadRequest(
          "This user has already borrowed this book"
        ),
      };
    } else {
      existingRecord.returnDate = null;
      existingRecord.score = null;

      await borrowRepository.save(existingRecord);

      return { borrow: existingRecord };
    }
  }

  const newBorrow = borrowRepository.create({
    book: {
      id: parseInt(bookId),
    },
    borrowDate: new Date(),
    user: {
      id: parseInt(userId),
    },
  });

  const borrow = await borrowRepository.save(newBorrow);

  return { borrow };
};

const updateReturnForUserBorrow = async (
  userId: string,
  bookId: string,
  score: number
): Promise<{ borrow: Borrow; error?: Error }> => {
  const borrowRepository = AppDataSource.getRepository(Borrow);

  const borrow = await borrowRepository.findOne({
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

  await borrowRepository.save(borrow);

  return { borrow };
};

const borrowService = {
  insertBorrowRecordForUser,
  updateReturnForUserBorrow,
};

export default borrowService;
