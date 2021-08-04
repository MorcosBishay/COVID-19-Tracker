const router = require("express").Router();
let Patient = require("../models/patient.model");

router.route("/").get((req, res) => {
  Patient.find()
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const temperature = req.body.temperature;
  const age = req.body.age;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const nationality = req.body.nationality;
  const weight = req.body.weight;
  const location = req.body.location;
  const gender = req.body.gender;
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  const country_code_iso3 = req.body.country_code_iso3;

  const newPatient = new Patient({
    name,
    temperature,
    age,
    email,
    phone_number,
    nationality,
    weight,
    location,
    gender,
    longitude,
    latitude,
    country_code_iso3,
  });

  newPatient
    .save()
    .then(() => res.json("Patient added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
