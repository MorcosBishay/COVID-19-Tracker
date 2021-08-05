import API from "../helpers/api";

const route = "patients";

export const getAllPatients = async () => {
  return API.get(`${route}`);
};

export const addPatient = async (body) => {
  return API.post(`${route}/add`, body);
};

export const getCounts = async () => {
  return API.get(`${route}/counts`);
};

const patientService = {
  getAllPatients,
  addPatient,
  getCounts,
};

export default patientService;
