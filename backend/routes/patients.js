const router = require("express").Router();
let Patient = require("../models/patient.model");
const _ = require("lodash");

router.route("/").get((req, res) => {
  Patient.find()
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/counts").get((req, res) => {
  Patient.find()
    .then(async (patients) => {
      let allCountries = [];
      let Table = [];
      let TableList = [];
      let data = [];
      patients.map((patient) => {
        allCountries.push(patient.country_code_iso3);
        Table.push(patient.location);
      });

      let a = [],
        b = [],
        arr = [...allCountries],
        prev,
        aTable = [],
        bTable = [],
        arrTable = [...Table],
        prevTable;

      await arr.sort();
      for (let element of arr) {
        if (element !== prev) {
          a.push(element);
          b.push(1);
        } else ++b[b.length - 1];
        prev = element;
      }

      await arrTable.sort();
      for (let elementT of arrTable) {
        if (elementT !== prevTable) {
          aTable.push(elementT);
          bTable.push(1);
        } else ++bTable[bTable.length - 1];
        prevTable = elementT;
      }

      const minValue = Math.min(...b) - 1;
      const maxValue = Math.max(...b);

      for (let i = 0; i < a.length; i++) {
        TableList.push({ country: aTable[i], count: bTable[i] });
        data.push({ id: a[i], val: b[i] });
      }

      TableList = _.orderBy(TableList, "count", "desc");

      res.json({
        TableList: TableList,
        data: data,
        minValue: minValue,
        maxValue: maxValue,
        patients: patients,
      });
    })
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
