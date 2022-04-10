import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state/Index";
import { useEffect, useRef, useState } from "react";
import { createHttpsRequest } from "../../utils/ApiRequests";

// Component used for initializing neccessary data (job, transcript...).
const Initializator = () => {
    const dispatch = useDispatch();
    const { createActionJobInitialize, createActionTranscriptInitialize } = bindActionCreators(actionCreators, dispatch);

    const [jobData, setJobData] = useState(null);
    const [jobTranscript, setJobTranscript] = useState(null);

    useEffect(() => {
      let currentJobId = window.location.pathname.substring(1);
      getJob(currentJobId);
      setTimeout(() => getJobTranscript(currentJobId), 10);
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

    return null;
}
 
export default Initializator;
