import express from "express";
import morgan from "morgan";
import cors from "cors";

import routes from "./Routes/routes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const app = express();

app.use(morgan('dev'));

// Agrega el middleware cors
app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use(express.json());

app.use(routes);
app.use(bodyParser.json());
app.use(cookieParser());

export default app;