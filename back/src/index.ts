import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import * as db from "db/connect";
dotenv.config();
import APIRouter from "api/router";
import AuthRouter from "auth/router";
import cookieParser from "cookie-parser";
import cors from "cors";
import { prod } from "secrets";
import { json as parseJson } from "body-parser";

const app: Express = express();
const port = process.env.port || 5001;
db.connect();
// logging middleware
app.use(morgan("[:method :status] ':url' | :response-time ms"));
// security middleware
app.use(helmet());
app.use(cookieParser());
app.use(parseJson());
app.use(
  cors({
    origin: prod ? "https://ridersity.tech" : "http://localhost:3001",
    credentials: true,
    allowedHeaders: ["X-Auth", "Content-Type", "Authorization"],
  })
);
// base route
app.get("/", (req: Request, res: Response) => {
  if (prod) {
    return res.redirect(process.env.front_url as string);
  }
  res.setHeader("X-Hello", "There");
  return res.status(299).send("👋 Backend Running");
});

// define api routes in external file
app.use("/api", APIRouter);
app.use("/auth", AuthRouter);

// start server
app.listen(port, () => {
  console.log(prod ? "Server started" : `Server running locally at http://localhost:${port}`);
});
