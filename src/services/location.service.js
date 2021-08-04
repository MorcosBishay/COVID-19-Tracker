import API from "../helpers/api";

export const getClientLocation = async () => {
  return API.get("https://ipapi.co/json/");
};

const locationService = {
  getClientLocation,
};

export default locationService;
