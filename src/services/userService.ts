import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import createError from "http-errors";

class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  fetchUsers = async (): Promise<{ users: User[] }> => {
    const users = await this.userRepository.find({
      select: {
        id: true,
        name: true,
      },
    });

    return { users };
  };

  fetchUserWithBorrows = async (
    userId: string
  ): Promise<{ data?: any; error?: Error }> => {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) },
      select: { id: true, name: true },
      relations: { borrows: { book: true } },
    });

    if (!user) {
      return { error: createError.NotFound("User not found") };
    }

    const data = {
      id: user.id,
      name: user.name,
      books: {
        past: user.borrows
          .filter((borrow) => borrow.returnDate !== null)
          .map((borrow) => ({
            name: borrow.book.name,
            userScore: borrow.score || -1,
          })),
        present: user.borrows
          .filter((borrow) => borrow.returnDate === null)
          .map((borrow) => ({
            name: borrow.book.name,
          })),
      },
    };

    return { data };
  };

  fetchUser = async (
    userId: string
  ): Promise<{ user: User; error?: Error }> => {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) },
      select: { id: true, name: true },
    });

    if (!user) {
      return { user, error: createError.NotFound("User not found") };
    }

    return { user };
  };

  insertUser = async (name: string): Promise<{ user: User }> => {
    const newUser = this.userRepository.create({
      name,
    });

    const user = await this.userRepository.save(newUser);

    return { user };
  };
}

export default new UserService();
