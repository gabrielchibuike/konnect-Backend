import express, { Request, Response } from "express";
import User from "../model/user";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const generateEmail = async (res: Response, email: string) => {
  const ResetPasswordToken = jwt.sign(
    { email: email },
    process.env.ACCESS_TOKEN_PRIVATE_KEY!,
    { expiresIn: "15m" }
  );
  try {
    const link = `https://konnect-xi.vercel.app/reset-password?token=${ResetPasswordToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const html = `<p>Click the above link to verify your email <a href = ${link}>${link}</a>.</p>`;
    const mailOptions = {
      from: "konnect@gmail.com",
      to: `${email}`,
      subject: "verify Email",
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
export default generateEmail;
