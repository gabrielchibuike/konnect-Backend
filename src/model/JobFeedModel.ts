import mongoose from "mongoose";

const JobsFeed = new mongoose.Schema({
  JobTitle: { type: String, required: true, minlength: 3, maxlength: 50 },
  Company: { type: String, required: true, minlength: 3, maxlength: 50 },
  JobLocation: { type: String, required: true, minlength: 3, maxlength: 50 },
  JobType: { type: String, required: true, minlength: 3, maxlength: 50 },
  Description: { type: String, required: true },
  Skills: { type: [], required: true },
  WorkPlaceType: { type: String, required: true, minlength: 3, maxlength: 50 },
  Currency: { type: String, required: true, minlength: 3, maxlength: 50 },
  Maximum: { type: String, required: true, minlength: 3, maxlength: 50 },
  Minimum: { type: String, required: true, minlength: 3, maxlength: 50 },
  Duration: { type: String, required: true, minlength: 3, maxlength: 50 },
  Benefits: { type: [], required: true },
  RecieveApplicant: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  date_added: { type: Date, default: Date.now() },
  visible: { type: Boolean, default: true },
});

const JobFeedTable = mongoose.model("jobsfeeds", JobsFeed);

export default JobFeedTable;
