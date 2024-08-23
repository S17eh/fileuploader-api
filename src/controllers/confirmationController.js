// src/controllers/confirmationController.js
import Author from "../models/Author.js";
import Book from "../models/Book.js";

export const confirmUpload = async (req, res) => {
  const { authors, books } = req.body;

  try {
    // Save authors
    for (const author of authors) {
      const existingAuthor = await Author.findOne({ email: author.email });
      if (!existingAuthor) {
        const newAuthor = new Author({
          name: author.name,
          email: author.email,
          dob: author.dob,
        });
        await newAuthor.save();
      }
    }

    // Save books
    for (const book of books) {
      const author = await Author.findById(book.authorId);
      if (author) {
        const newBook = new Book({
          name: book.name,
          isbnCode: book.isbnCode,
          author: author._id,
        });
        await newBook.save();
      }
    }

    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving data: " + error.message });
  }
};
