import express, { Request, Response } from "express";
const EditRoute = express.Router();
import { UserDocument } from "../../Interface/user_interface";
import User from "../../model/user";
import jwt from "jsonwebtoken";
import { verifyJwt } from "../../utils/verifyJwt";
import { changePasswordSchema } from "../../utils/validation";

EditRoute.post("/change_password", async (req: Request, res: Response) => {
  const { email, OldPassword, Newpassword }: UserDocument = req.body;
  try {
    const { error } = changePasswordSchema.validate({
      Newpassword,
    });
    if (error) return res.status(401).send(error.details[0]!.message);
    const existingUser = await User.findOne({ password: OldPassword });
    if (!existingUser) return res.status(401).send("Incorrect details!");
    const query = await User.findOneAndUpdate(
      { email: email },
      { password: Newpassword },
      { new: true }
    );
    return res.json({ status: "ok", msg: "Sucessful" });
  } catch (err) {
    return res.send(err);
  }
});

EditRoute.post("/edit_profile", async (req: Request, res: Response) => {
  const {
    email,
    firstName,
    lastName,
    state,
    postal_code,
    Country,
  }: UserDocument = req.body;

  try {
    const userDetails = await User.findOne({ email });

    const id = userDetails?._id;
    const desired_jobs = userDetails?.desired_jobs;

    const old_firstName = userDetails?.firstName;
    const old_lastName = userDetails?.lastName;
    const old_State = userDetails?.state;
    const old_postal_code = userDetails?.postal_code;

    const query = await User.findOneAndUpdate(
      { email },
      {
        firstName: firstName ? firstName : old_firstName,
        lastName: lastName ? lastName : old_lastName,
        state: state ? state : old_State,
        postal_code: postal_code ? postal_code : old_postal_code,
      },
      { new: true }
    );
    const AccessToken = jwt.sign(
      {
        id,
        email: email,
        firstName: firstName ? firstName : old_firstName,
        lastName: lastName ? lastName : old_lastName,
        desired_jobs,
      },
      process.env.ACCESS_TOKEN_PRIVATE_KEY!,
      { expiresIn: "1d" }
    );
    return res.send(AccessToken);
  } catch (err) {
    return res.send(err);
  }
});

export default EditRoute;
