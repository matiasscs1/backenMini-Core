import express from "express";
import morgan from "morgan";
import cors from "cors";

import routes from "./Routes/routes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(morgan('dev'));

// Configura el middleware cors para permitir múltiples orígenes
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://legendary-faun-c649cc.netlify.app',
      'https://cliente-mini-core.vercel.app',
      'https://cliente-mini-core-f83k65dt9-matis-projects-3d0af87c.vercel.app/'
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);
app.use(bodyParser.json());
app.use(cookieParser());

export default app;
