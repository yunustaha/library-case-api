import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.borrows)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrows)
  @JoinColumn({ name: "book_id" })
  book: Book;

  @CreateDateColumn({ type: "timestamp" })
  borrowDate: Date;

  @Column({ type: "timestamp", nullable: true })
  returnDate: Date;

  @Column({ type: "int", nullable: true })
  score: number;
}
