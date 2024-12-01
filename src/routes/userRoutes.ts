import express from "express";
const router = express.Router();
import userController from "../controllers/userController";
import userSchema from "../schemas/userSchema";
import validationHandler from "../middlewares/validationHandler";

router.post(
  "/",
  validationHandler(userSchema.postUser),
  userController.postUser
);
router.get("/", userController.getUsers);
router.get(
  "/:id",
  validationHandler(userSchema.getUser),
  userController.getUser
);
router.post(
  "/:id/borrow/:bookId",
  validationHandler(userSchema.addBorrowRecordForUser),
  userController.addBorrowRecordForUser
);
router.post(
  "/:id/return/:bookId",
  validationHandler(userSchema.addReturnForUserBorrow),
  userController.addReturnForUserBorrow
);

const userRoutes = router;

export default userRoutes;
