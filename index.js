import express from "express";
import dotenv from "dotenv";
import connect from "./src/config/connect.js"; // Import the connect function
import router from "./src/routes/uploadRoutes.js";
import errHandler from "./src/middleware/errHandler.js";
import cors from "cors";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB
connect();

app.use(cors());
// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files from 'uploads' directory

// Routes
// app.get("/", res.json({ message: "Welcome to the file upload API" }));
app.use("/api", router);

// Error Handling Middleware
app.use(errHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
