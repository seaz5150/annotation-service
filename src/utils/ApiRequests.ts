import axios from "axios";

const apiToken = "tyksc1fgc3jj5x6oc1wmxj3pabo74imfzpt8ittj";
const path = "https://api.spokendata.com/v2/";

export const createHttpsRequest = async (
  data: any,
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" ) => {

  return await axios.request({
    url: path + endpoint,
    method: method,
    headers: {
      "accept": "application/json",
      "X-API-KEY": apiToken,
    },
    ...data,
    })
    .then((response: { data: any; status: any; statusText: any; }) => {
      return { data: response.data, status: response.status, statusText: response.statusText };
    })
    .catch((error: { response: { status: any; data: any; }; }) => {
      if (!error.response) {
        return { status: "", data: "" };
      }
      console.error(error.response);

      return { status: error.response.status, data: error.response.data };
    });
};