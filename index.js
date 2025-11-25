import 'dotenv/config';
import app from "./src/app.js";
import { initDB } from "./src/config/dbConfig.js";
import "./src/models/userModel.js"

const PORT = process.env.PORT || 5000;

initDB();

app.listen(PORT, () => console.log("Server running on " + PORT));
