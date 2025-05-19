// 📁 routes/book.js (добавлены действия лайка, сохранения, комментариев)
import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import Comment from "../models/Comment.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Новый: Лайк или дизлайк книги
router.patch("/:id/like", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const liked = book.likes.includes(req.user._id);
    if (liked) {
      book.likes.pull(req.user._id);
    } else {
      book.likes.push(req.user._id);
    }
    await book.save();
    res.json({ likes: book.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Новый: Сохранить или удалить из сохраненного
router.patch("/:id/save", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const saved = book.saves.includes(req.user._id);
    if (saved) {
      book.saves.pull(req.user._id);
    } else {
      book.saves.push(req.user._id);
    }
    await book.save();
    res.json({ saves: book.saves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Новый: Добавить комментарий
router.post("/:id/comments", protectRoute, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const comment = new Comment({
      text,
      user: req.user._id,
      book: req.params.id,
    });
    await comment.save();
    await comment.populate("user", "username profileImage");

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Новый: Получить комментарии к книге
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ book: req.params.id })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
