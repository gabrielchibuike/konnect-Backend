import JobFeedTable from "../model/JobFeedModel";

export async function searchJobs(
  Jobs: any,
  Location: any,
  Job_Type: any,
  workPlaceType: any
) {
  const jobRegex = new RegExp(Jobs, "i");
  const LocationRegex = new RegExp(Location, "i");
  const Job_TypeRegex = new RegExp(Job_Type, "i");
  const work_TypeRegex = new RegExp(workPlaceType, "i");

  const JobResult = await JobFeedTable.find({
    JobTitle: { $regex: jobRegex },
    JobLocation: { $regex: LocationRegex },
    JobType: { $regex: Job_TypeRegex },
    WorkPlaceType: { $regex: work_TypeRegex },
  });
   
  return JobResult
}
