// src/index.js
import dotenv from "dotenv";
dotenv.config(); // Esta línea carga las variables de entorno desde .env

import { connectDB } from "./db.js";

import app from './app.js';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

