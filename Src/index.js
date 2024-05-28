import app from './app.js'
import {connectDB} from './db.js'

app.listen(process.env.PORT ||  3000);
connectDB();

console.log("Server is running on port 3000");