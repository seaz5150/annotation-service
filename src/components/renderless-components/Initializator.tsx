import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state/Index";
import { useEffect, useRef, useState } from "react";
import { createHttpsRequest } from "../../utils/ApiRequests";

// Component used for initializing neccessary data (job, transcript...).
const Initializator = () => {
    const dispatch = useDispatch();
    const { createActionJobInitialize, 
            createActionTranscriptInitialize, 
            createActionJobListInitialize } = bindActionCreators(actionCreators, dispatch);

    const [jobList, setJobList] = useState(null);
    const [jobData, setJobData] = useState(null);
    const [jobTranscript, setJobTranscript] = useState(null);
    const job = useSelector((state: any) => state.job);

    useEffect(() => {
      getJobList();
    }, [window.location.pathname]);

    useEffect(() => {
      if (jobTranscript !== null) {
        createActionTranscriptInitialize(jobTranscript);
      }
    }, [jobTranscript]);

    useEffect(() => {
      if (jobData !== null) {
        createActionJobInitialize(jobData);
      }
    }, [jobData]);

    useEffect(() => {
      if (jobList !== null) {
        createActionJobListInitialize(jobList);
      }
    }, [jobList]);

    useEffect(() => {
      if (job.jobList.length != 0) {
        let currentJobId = window.location.pathname.substring(1);
        getJob(currentJobId);
        setTimeout(() => getJobTranscript(currentJobId), 10);
      }
    }, [job.jobList]);

    const getJobTranscript = async (jobId: string) => {
      var requestReturn;
      let request = "jobs/" + jobId + "/transcript";
    
      requestReturn = await createHttpsRequest({}, request, "GET");
      if (requestReturn.status !== 200) {
        console.error("ERROR", requestReturn);
        return;
      }
    
      setJobTranscript(requestReturn.data);
    }
    
    const getJob = async (jobId: string) => {
        var requestReturn;
        let request = "jobs/" + jobId;
    
        requestReturn = await createHttpsRequest({}, request, "GET");
        if (requestReturn.status !== 200) {
          console.error("ERROR", requestReturn);
          return;
        }
      
        setJobData(requestReturn.data);
    }

    const getJobList = async () => {
      var requestReturn;
      let request = "jobs";
  
      requestReturn = await createHttpsRequest({}, request, "GET");
      if (requestReturn.status !== 200) {
        console.error("ERROR", requestReturn);
        return;
      }
    
      setJobList(requestReturn.data);
  }

    return null;
}
 
export default Initializator;
