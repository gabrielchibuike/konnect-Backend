import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const generateEmail2 = async (
  res: Response,
  jobId: string,
  senderEmail: string,
  recieverEmail: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const link = `https://konnect-ghtn.onrender.com/review-application?id=${jobId}`;
    const html = `<button className="p-3 w-10 bg-blue-700 text-white"> <a href = ${link}>Review Application</a>.</button>`;
    const mailOptions = {
      from: `${senderEmail}`,
      to: `${recieverEmail}`,
      subject: "New Applicant",
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        res.send("Email sent! successfull");
        console.log("Email sent:", info.response);
      }
    });
  } catch (err) {
    res.json({ status: "error", msg: err });
    console.log(err);
  }
};
export default generateEmail2;
