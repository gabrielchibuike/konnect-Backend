import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const declinedApplicationEmail = async (
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

    const html = `Sorry your application was declined. <br /> Don't be discourage,you can still get your dream job.`;
    const mailOptions = {
      from: `${senderEmail}`,
      to: `${recieverEmail}`,
      subject: "Application declined",
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
export default declinedApplicationEmail;
