import express, { Request, Response } from "express";
import mongoose from "mongoose";
import user_route from "./Routes/access/user_Auth";
import JobFeedRoute from "./Routes/JobFeed/Job";
import SavedJobRoute from "./Routes/SavedJob/saved_job";
import { verifyJwt } from "./utils/verifyJwt";
import dotenv from "dotenv";
import JobFeedTable from "./model/JobFeedModel";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import EditRoute from "./Routes/access/Edit_Details";
import handleApp from "./Routes/JobFeed/handleApplication";
dotenv.config();

const app = express();

// socket io connection
// const httpServer = http.createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });
// io.listen(3000);
//

// connetion to database
const mongodbUrl = process.env.DATABASE;
mongoose
  .connect(mongodbUrl as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const corsOptions = {
  origin: "https://konnect-ghtn.onrender.com",
  methods: ["GET", "POST"],
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/uploads"));

app.use("/api/access", user_route);
app.use("/api", verifyJwt, JobFeedRoute);
app.use("/api", verifyJwt, handleApp);
app.use("/api", verifyJwt, EditRoute);
app.use("/api", verifyJwt, SavedJobRoute);

app.listen(process.env.PORT || 5000, async () => {
  try {
    console.log("server is running on port " + process.env.PORT);
  } catch (err) {
    console.log(err);
  }
});
