import JobFeedTable from "../model/JobFeedModel";

export async function filterJobs(Job_Type: any, workPlaceType: any) {
  const Job_TypeRegex = new RegExp(Job_Type, "i");
  const workPlaceTypeRegex = new RegExp(workPlaceType, "i");
  return await JobFeedTable.find({
    JobType: { $regex: Job_TypeRegex },
    workPlaceType: { $regex: workPlaceTypeRegex },
  });
}
