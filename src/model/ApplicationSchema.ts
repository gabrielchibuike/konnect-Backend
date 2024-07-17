import mongoose from "mongoose";
// const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  city: { type: String },
  email: { type: String, required: true },
  reciever: { type: String, required: true },
  resume: { type: String, required: true },
  status: { type: String, required: true },
});

const ApplicationModel = mongoose.model("ApplicationSchema", ApplicationSchema);

export default ApplicationModel;
