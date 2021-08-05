const yup = require("yup");

const nameRegex = /^[a-zA-Z\s]*$/;
const tempRegex = /^[3][0-9](?:\.\d)?$|^[4][0-5](?:\.\d)?$/;
const ageRegex = /^[1-9]$|^[1-9][0-9]$|^[1][0-4][0-9]$|^[1][5][0]$/;
const phoneRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const weightRegex =
  /^[1-9](?:\.\d)?$|^[1-9][0-9](?:\.\d)?$|^[1-3][0-9][0-9](?:\.\d)?$|^[4][0][0]$/;

const patientSchema = yup.object().shape({
  name: yup
    .string()
    .matches(nameRegex, "Name must be only letters")
    .required("Name is required"),
  temperature: yup
    .string()
    .required("Temperature is required")
    .matches(tempRegex, "Temperature must be between 30 and 45"),
  age: yup
    .string()
    .required("Age is required")
    .matches(ageRegex, "Please enter a valid age"),
  email: yup.string().email("Enter valid email").required("Email is required"),
  phone_number: yup
    .string()
    .required("Phone Number is required")
    .matches(phoneRegex, "Phone number is not valid"),
  // nationality: yup.string().required("Nationality is required"),
  weight: yup
    .string()
    .required("Weight is required")
    .matches(weightRegex, "Weight must be between 1 and 400"),
  // gender: yup.string().required("Gender is required"),
});

module.exports = {
  patientSchema,
};
