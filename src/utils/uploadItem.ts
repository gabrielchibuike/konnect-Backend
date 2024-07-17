import { error } from "console";
import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const origin = file.originalname.split(".")[0];
    const ext = path.extname(file.originalname);
    const newExt = origin + ext;
    const arrExt = [".pdf", ".doc", ".docx", "rtf"];
    if (arrExt.includes(ext) == true) {
      cb(null, newExt);
    } else {
      console.log("not supported");
    }
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1048576 * 5,
  },
});

// const limit = (err, req, res, next) => {
//   if (err) {
//     return res.status(400).send("File size exceeds the limit.");
//   }
//   next(err);
// };
