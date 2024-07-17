import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const acceptApplicationEmail = async (
  res: Response,
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

    const html = `Congratulation your application has been approved. we will send you an email to procced with the next step.`;
    const mailOptions = {
      from: `${senderEmail}`,
      to: `${recieverEmail}`,
      subject: "Application accepted",
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
export default acceptApplicationEmail;
