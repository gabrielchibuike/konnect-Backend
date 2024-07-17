import express, { Request, Response } from "express";
const JobFeedRoute = express.Router();
import JobFeedTable from "../../model/JobFeedModel";
import { searchJobs } from "../../utils/search_query";

JobFeedRoute.post("/create_job", async (req: Request, res: Response) => {
  try {
    const values = req.body;
    const existingProduct = await JobFeedTable.findOne({
      Description: values.Description,
    });
    if (existingProduct) {
      console.log("Already existing!!");
      res.send("Already existing!!");
    } else {
      const query = await JobFeedTable.create(values);
      if (query) res.json({ status: "ok", msg: "product added sucessfully" });
    }
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

JobFeedRoute.get("/allJobs", async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const newPage = parseInt(page as unknown as string);

    const newLimit = parseInt(limit as unknown as string);
    
    const skip = (newPage - 1) * newLimit;

    const Feed = await JobFeedTable.find({}).limit(newLimit * 1).skip(skip);

   const count =  await JobFeedTable.countDocuments();

    // if (Feed.length == 0) return res.status(201).send([]);
    return res.status(200).json({Feed, totalPage : count});
  } catch (err) {
    console.log(err);
  }
});

JobFeedRoute.get("/allJobs/:_id", async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const Feed = await JobFeedTable.find({ _id });
    if (Feed.length == 0) return res.status(500).send("Server Error!!");
    return res.status(200).send(Feed);
  } catch (err) {
    console.log(err);
  }
});

JobFeedRoute.post("/search-jobs", async (req: Request, res: Response) => {
  const { Jobs, Location, Job_Type, workPlaceType } = req.query;
  // const { error } = jobPrefrenceSchema.validate({ Jobs });
  // if (error) return res.status(400).send(error.details[0]!.message);
  try {
    const result = await searchJobs(Jobs, Location, Job_Type, workPlaceType);
    res.json(result);
    // console.log(result);
  } catch (error) {
    res.status(500).json({ message: "Error searching Jobs" });
  }
});

export default JobFeedRoute;
