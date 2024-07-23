import express, { Request, Response } from "express";
const route = express.Router();
import { UserDocument } from "../../Interface/user_interface";
import User from "../../model/user";
import jwt from "jsonwebtoken";
import { verifyJwt } from "../../utils/verifyJwt";
import sha1 from "sha1";
import {
  createAccSchema,
  loginSchema,
  emailSchema,
  updateSchema,
  moreUserInfo,
} from "../../utils/validation";
import generateEmail from "../../utils/generate_Email";

route.post("/create_user", async (req: Request, res: Response) => {
  const { email, password }: UserDocument = req.body;
  try {
    const hashedPassword = sha1(password);
    const { error } = createAccSchema.validate({
      email,
      password,
    });
    if (error) return res.status(401).send(error.details[0]!.message);
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).send("User already exist on database");
    const result = await User.create({ email, password: hashedPassword });
    const AccessToken = jwt.sign(
      { id: result._id, email: email },
      process.env.ACCESS_TOKEN_PRIVATE_KEY!,
      { expiresIn: "1hrs" }
    );
    console.log("vgvg");

    res.status(200).send(AccessToken);
  } catch (err) {
    console.log(err);
  }
});

route.post("/more_user_info", async (req: Request, res: Response) => {
  const { id, email, firstName, lastName, state, postal_code, desired_jobs } =
    req.body;
  const { error } = moreUserInfo.validate({
    firstName,
    lastName,
    state,
    postal_code,
    // desired_jobs,
  });
  if (error) return res.status(401).send(error.details[0]!.message);
  try {
    await User.findOneAndUpdate(
      { _id: id },
      { firstName, lastName, state, postal_code, desired_jobs },
      { new: true }
    );
    const AccessToken = jwt.sign(
      { _id: id, email: email, firstName, lastName, desired_jobs },
      process.env.ACCESS_TOKEN_PRIVATE_KEY!,
      { expiresIn: "1hrs" }
    );
    res.status(200).send(AccessToken);
  } catch (err) {
    res.status(500).send("Server Error!!");
    console.log(err);
  }
});

route.post("/login", async (req: Request, res: Response) => {
  const { email, password }: UserDocument = req.body;
  const existingUser = await User.findOne({ email });
  const hashedPassword = sha1(password);
  if (!existingUser) return res.status(404).send("User not found on database");
  const getUserdetails = await User.findOne({ email });
  const userId = getUserdetails?._id;
  const firstName = getUserdetails?.firstName;
  const lastName = getUserdetails?.lastName;
  const desired_jobs = getUserdetails?.desired_jobs;
  try {
    const response = await User.findOne({ email, password: hashedPassword });
    const AccessToken = jwt.sign(
      { id: userId, email: email, firstName, lastName, desired_jobs },
      process.env.ACCESS_TOKEN_PRIVATE_KEY!,
      { expiresIn: "1d" }
    );
    if (response) {
      return res.send(AccessToken);
    } else {
      return res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.log(err);
  }
});

route.post("/userEmail", async (req: Request, res: Response) => {
  const { email }: UserDocument = req.body;
  const { error } = emailSchema.validate(req.body);
  if (error) return res.status(401).send(error.details[0]!.message);
  const isExisting = await User.findOne({ email });
  if (!isExisting) return res.status(400).json({ message: "User not found" });
  await generateEmail(res, email);
});

route.post(
  "/reset_password",
  verifyJwt,
  async (req: Request, res: Response) => {
    const { email, password }: UserDocument = req.body;
    const hashedPassword = sha1(password);
    const query = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    if (query) {
      return res.json({ status: "ok", msg: "Sucessful" });
    } else {
      return res.json({ status: "error", msg: "Update Not Sucessful" });
    }
  }
);

route.get("/home", verifyJwt, async (req: Request, res: Response) => {
  res.json({ msg: "done" });
});

// route.post()

export default route;
