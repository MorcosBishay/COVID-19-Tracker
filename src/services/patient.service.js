import API from "../helpers/api";

const route = "patients";

export const getAllPatients = async () => {
  return API.get(`${route}`);
};

export const addPatient = async (body) => {
  return API.post(`${route}/add`, body);
};

const patientService = {
  getAllPatients,
  addPatient,
};

export default patientService;
