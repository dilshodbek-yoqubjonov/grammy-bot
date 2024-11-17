import express, { urlencoded } from "express";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.set("view engine", "ejs");
app.set("views", __dirname);
app.use(express.static(__dirname + "/views"));

const port = process.env.PORT;
app.listen(port || 8000, () => console.info(`Server runned at port ${port}`));
