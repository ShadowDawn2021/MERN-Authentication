import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRoute from "./routes/authRoute.js";
import userAuth from "./middleware/userAuth.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

//API's
app.get("/", (req, res) => {
  res.send("API working");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`app is listening to port ${port}`);
});
