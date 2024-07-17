import mongoose from "mongoose";
// const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  Phone_number: { type: String },
  street_address: { type: String },
  state: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
  postal_code: { type: String },
  desired_jobs : {type: [] },
  saved_jobs : {type: [] },
  timeSent: { type: String },
  verified: { type: String },
});

const User = mongoose.model("users", UserSchema);

export default User;
