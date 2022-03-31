import axios from "axios";

const apiToken = "tyksc1fgc3jj5x6oc1wmxj3pabo74imfzpt8ittj";

export const createHttpsRequest = async (
    config: any,
    endpoint: string,
    method: "POST" | "DELETE" | "GET" | "PATCH" | "PUT"
  ) => {
    let path = "https://api.spokendata.com/v2/";
    return await axios
      .request({
        url: path + endpoint,
        method: method,
        headers: {
          "accept": "application/json",
          "X-API-KEY": apiToken,
        },
        ...config,
      })
      .then((r: { data: any; status: any; statusText: any; }) => {
        return { data: r.data, status: r.status, statusText: r.statusText };
      })
      .catch((err: { response: { status: any; data: any; }; }) => {
        if (!err.response) return { status: "", data: "" };
        console.error(err.response);
        return { status: err.response.status, data: err.response.data };
      });
  };