import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./Routes/routes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(morgan('dev'));

// Configura el middleware cors para permitir múltiples orígenes específicos
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://legendary-faun-c649cc.netlify.app',
      'https://cliente-mini-core.vercel.app',
      'https://adminmapp.onrender.com',
      'https://cliente-mini-core-az3z.vercel.app',
      'http://localhost:8080',
      'http://localhost:8081'
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(routes);

export default app;
