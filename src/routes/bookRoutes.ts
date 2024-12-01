import express from "express";
import bookController from "../controllers/bookController";
import validationHandler from "../middlewares/validationHandler";
import bookSchema from "../schemas/bookSchema";
const router = express.Router();

router.post(
  "/",
  validationHandler(bookSchema.postBook),
  bookController.postBook
);
router.get("/", bookController.getBooks);
router.get(
  "/:id",
  validationHandler(bookSchema.getBook),
  bookController.getBook
);

const bookRoutes = router;

export default bookRoutes;
