import express, { Request, Response } from "express";
import ApplicationModel from "../../model/ApplicationSchema";
import { upload } from "../../utils/uploadItem";
import generateEmail2 from "../../utils/generate_Email2";
import JobFeedTable from "../../model/JobFeedModel";
import dotenv from "dotenv";
import acceptApplicationEmail from "../../utils/acceptApplicationEmail";
import declinedApplicationEmail from "../../utils/declineApplicationEmail";
dotenv.config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // folder: "Home/gabbySoft",
});

const handleApp = express.Router();

handleApp.post(
  "/apply",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (req.file) {
        const { filename } = req.file!;
        const result = await cloudinary.uploader.upload(req.file!.path, {
          folder: `${filename.split(".")[0]}`,
          public_id: filename.split(".")[0],
        });
        console.log(result);

        const { id, reciever, firstName, lastName, email, city, status } =
          JSON.parse(req.body.jsonData);

        const values = {
          jobId: id,
          reciever: reciever,
          firstName: firstName,
          lastName: lastName,
          email: email,
          city: city,
          resume: result.secure_url,
          status: status,
        };

        const existingProduct = await ApplicationModel.findOne(values);
        if (existingProduct)
          return res.status(408).send("You already applied for this role");
        const query = await ApplicationModel.create(values);
        if (query) res.send("Application added sucessfully");
        generateEmail2(res, values.jobId, values.email, values.reciever);
      }
    } catch (err) {
      res.sendStatus(500);
      console.log(err);
    }
  }
);

handleApp.get("/applied-jobs/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const query = await ApplicationModel.findOne({ email: email });
    let newData: any = [];
    if (query) {
      const query2 = await JobFeedTable.findOne({ _id: query?.jobId });
      const values = {
        JobTitle: query2?.JobTitle,
        Company: query2?.Company,
        JobLocation: query2?.JobLocation,
        JobType: query2?.JobType,
        Description: query2?.Description,
        WorkPlaceType: query2?.WorkPlaceType,
        Currency: query2?.Currency,
        Maximum: query2?.Maximum,
        Minimum: query2?.Minimum,
        Benefits: query2?.Benefits,
        RecieveApplicant: query2?.RecieveApplicant,
        Status: query.status,
        date_added: query2?.date_added,
      };
      newData.push(values);
      console.log(newData);
      res.status(200).send(newData);
    } else {
      console.log("null");
    }
  } catch (err) {
    console.log(err);
  }
});

handleApp.get("/review-application/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = await JobFeedTable.findById({ _id: id });
    res.status(200).send(query);
  } catch (err) {
    console.log(err);
  }
});

handleApp.get("/get-application/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const query = await ApplicationModel.findOne({ jobId: id });
    console.log(query);

    res.status(200).send(query);
  } catch (err) {
    console.log(err);
  }
});

handleApp.post("/accept-application", async (req, res) => {
  try {
    const { sender_email, reciver_email } = req.body;
    
    const query = await ApplicationModel.findOne({
      email: sender_email,
      reciever: reciver_email,
    });
    if (query!.status == "pending") {
      acceptApplicationEmail(res, sender_email, reciver_email);
      const result = await ApplicationModel.findOneAndUpdate(
        { email: sender_email, reciever: reciver_email },
        { status: "accepted" },
        { new: true }
      );
      console.log(query);
      res.status(200).send("Application accepted");
    }
    res.status(200).send("Application has been reviewed");
  } catch (err) {
    console.log(err);
  }
});

handleApp.post("/decline-application", async (req, res) => {
  const { sender_email, reciver_email } = req.body;
  try {
    const query = await ApplicationModel.findOne({
      email: sender_email,
      reciever: reciver_email,
    });
    if (query!.status == "pending") {
      declinedApplicationEmail(res, sender_email, reciver_email);
      const result = await ApplicationModel.findOneAndUpdate(
        { email: sender_email, reciever: reciver_email },
        { status: "declined" },
        { new: true }
      );
      res.status(200).send("Application declined");
    }
    res.status(200).send("Application has been reviewed");
  } catch (err) {
    console.log(err);
  }
});

export default handleApp;
