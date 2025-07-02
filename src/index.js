// src/index.js
import dotenv from "dotenv";
dotenv.config(); // Esta línea carga las variables de entorno desde .env

import express from "express";
import { connectDB } from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

