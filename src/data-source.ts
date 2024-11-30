import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Book } from "./entity/Book";
import { Borrow } from "./entity/Borrow";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Book, Borrow],
  migrations: [],
  subscribers: [],
});
