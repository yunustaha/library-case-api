import express from "express";
import bookController from "../controllers/bookController";
const router = express.Router();

router.post("/", bookController.postBook);
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBook);

const bookRoutes = router;

export default bookRoutes;
