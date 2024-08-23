// src/controllers/uploadController.js
import multer from "multer";
import parseExcelFile from "../utils/parseExcelFile.js";
import Author from "../models/Author.js";
import Book from "../models/Book.js";

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

const validateAuthor = (author) => {
  const errors = {};
  if (!author["Author Name"] || typeof author["Author Name"] !== "string") {
    errors.name = "Invalid or missing name.";
  }
  if (
    !author["Author Email"] ||
    !/^\S+@\S+\.\S+$/.test(author["Author Email"])
  ) {
    errors.email = "Invalid email format.";
  }
  if (!author["Date of Birth"] || isNaN(Date.parse(author["Date of Birth"]))) {
    errors.dob = "Invalid date of birth.";
  }
  return errors;
};

const validateBook = (book) => {
  const errors = {};
  if (!book["Book Name"] || typeof book["Book Name"] !== "string") {
    errors.name = "Invalid or missing book name.";
  }
  if (!book["ISBN Code"] || typeof book["ISBN Code"] !== "string") {
    errors.isbnCode = "Invalid or missing ISBN code.";
  }
  if (!book["Author Id"] || !book["Author Id"].match(/^[0-9a-fA-F]{24}$/)) {
    errors.authorId = "Invalid or missing author ID.";
  }
  return errors;
};

const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "Error uploading file" });
    }

    try {
      const data = parseExcelFile(req.file.buffer);

      const authorsData = data.filter((row) => row["Author Name"]);
      const booksData = data.filter((row) => row["Book Name"]);

      let invalidAuthors = [];
      let invalidBooks = [];

      for (const author of authorsData) {
        const errors = validateAuthor(author);
        if (Object.keys(errors).length > 0) {
          invalidAuthors.push({ ...author, errors });
        }
      }

      for (const book of booksData) {
        const errors = validateBook(book);
        if (Object.keys(errors).length > 0) {
          invalidBooks.push({ ...book, errors });
        }
      }

      if (invalidAuthors.length > 0 || invalidBooks.length > 0) {
        return res.status(400).json({
          error: "Invalid data found",
          invalidAuthors,
          invalidBooks,
        });
      }

      // Data is valid, store it in memory for confirmation
      res.status(200).json({
        message: "Data is valid",
        authors: authorsData,
        books: booksData,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error processing file: " + error.message });
    }
  });
};

export { uploadFile };
