// src/controllers/uploadController.js
import multer from "multer";
import parseExcelFile from "../utils/parseExcelFile.js";

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

// Upload file and handle data
const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "Error uploading file" });
    }

    try {
      const data = parseExcelFile(req.file.buffer);

      // Filter authors and books data
      const authorsData = data.filter((row) => row["Author Name"]);
      const booksData = data.filter((row) => row["Book Name"]);

      // Return valid data
      res.status(200).json({
        message: "Data processed successfully",
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
