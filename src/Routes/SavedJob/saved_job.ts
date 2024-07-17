import express, { Request, Response } from "express";
import User from "../../model/user";
const SavedJobRoute = express.Router();

SavedJobRoute.post("/save-jobs/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const job_id = req.body;
  try {
    const user = await User.findOne({ _id: id });
    const isExisting = user?.saved_jobs.find(
      (saved_jobs) => saved_jobs._id == job_id._id
    );
    if (isExisting) {
      res.status(201).send("Job is already saved");
    } else {
      user?.saved_jobs.push(job_id);
      await user?.save();
      res.status(200).send("job saved");
    }
  } catch (error) {
    res.status(500).send("Error saving job");
  }
});

SavedJobRoute.get("/read-jobs/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    const Read_Jobs = user?.saved_jobs;
    res.status(200).send(Read_Jobs);
  } catch (error) {
    res.status(500).json({ message: "Error searching users" });
  }
});

SavedJobRoute.delete(
  "/remove-jobs/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const job_id = req.body._id;
    try {
      const user = await User.findOne({ _id: id });
      let Remove_Jobs = user?.saved_jobs as unknown as any[];
      Remove_Jobs = Remove_Jobs.filter(
        (Remove_Jobs) => Remove_Jobs._id != job_id
      );
      user!.saved_jobs = Remove_Jobs;
      await user!.save();
      res.status(200).send(Remove_Jobs);
    } catch (error) {
      res.status(500).json({ message: "Error searching users" });
    }
  }
);

export default SavedJobRoute;
