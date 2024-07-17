import mongoose from "mongoose";

const Reviews = new mongoose.Schema({
  product_id: { type: String, required: true },
  user_id: { type: String, required: true },
  user_name: { type: String, required: true },
  host_id: { type: String, required: true },
  host_type: { type: String, required: true },
  review: { type: String, required: true },
  date_added: { type: Date, default: Date.now() },
  visible: { type: Boolean, default: true },
});

const productReview = mongoose.model("reviews", Reviews);


export default productReview;