import axios from "axios";

const axiosRetry = require("axios-retry");

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
  headers: {
    common: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
});

axiosRetry(API, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export default API;
