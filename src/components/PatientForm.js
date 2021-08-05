import React, { useState, useEffect, useMemo } from "react";
import { patientService, locationService } from "../services";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import countryList from "react-select-country-list";
import { patientSchema } from "../validations/validation.schemas";

const PatientForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(patientSchema),
  });

  const [location, setLocation] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [country_code_iso3, setISO3] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  var [genderError, setGenderError] = useState(false);
  var [nationalityError, setNationalityError] = useState(false);
  const nationalityOptions = useMemo(() => countryList().getData(), []);
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handelSubmit = () => {
    if (gender === "") {
      setGenderError(true);
    }
    if (nationality === "") {
      setNationalityError(true);
    }
  };

  const changeNationalityHandler = (value) => {
    setNationality(value);
    setNationalityError(false);
  };

  const changeGenderHandler = (value) => {
    setGender(value);
    setGenderError(false);
  };

  useEffect(() => {
    locationService
      .getClientLocation()
      .then((response) => {
        let data = response.data;
        setLocation(data.country_name);
        setLongitude(data.longitude);
        setLatitude(data.latitude);
        setISO3(data.country_code_iso3);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = (data, e) => {
    console.log(data);
    e.preventDefault();
    const patient = {
      name: data.name,
      temperature: data.temperature,
      age: data.age,
      email: data.email,
      phone_number: data.phone_number,
      nationality: nationality.label,
      weight: data.weight,
      location,
      gender: gender.label,
      longitude,
      latitude,
      country_code_iso3,
    };

    patientService
      .addPatient(patient)
      .then((res) => alert(res.data))
      .catch((res) => {
        alert(res);
      });
    e.target.reset();
    setNationality("");
    setGender("");
  };

  return (
    <div
      className="container"
      style={{
        backgroundColor: "cadetblue",
        borderRadius: "15px",
        padding: "3px",
      }}
    >
      <h3
        style={{
          width: "60%",
          margin: "30px auto",
          display: "flex",
          justifyContent: "center",
          fontSize: "50px",
          fontWeight: "bold",
        }}
      >
        Add New Patient
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group" style={{ width: "60%", margin: "0 auto" }}>
          <label>Name *</label>
          <input type="text" className="form-control" {...register("name")} />
          <p className="err">{errors.name?.message}</p>
          <label>Temperature (°C) *</label>
          <input className="form-control" {...register("temperature")} />
          <p className="err">{errors.temperature?.message}</p>
          <label>Age *</label>
          <input className="form-control" {...register("age")} />
          <p className="err">{errors.age?.message}</p>
          <label>Email *</label>
          <input className="form-control" {...register("email")} />
          <p className="err">{errors.email?.message}</p>
          <label>Phone Number *</label>
          <input className="form-control" {...register("phone_number")} />
          <p className="err">{errors.phone_number?.message}</p>
          <label>Weight (kg) *</label>
          <input className="form-control" {...register("weight")} />
          <p className="err">{errors.weight?.message}</p>
          <label>Nationality *</label>
          <Select
            options={nationalityOptions}
            value={nationality}
            onChange={changeNationalityHandler}
          />
          {nationalityError ? (
            <p className="err">Nationality is required</p>
          ) : (
            <br />
          )}
          <label>Gender *</label>
          <Select
            options={genderOptions}
            value={gender}
            onChange={changeGenderHandler}
          />
          {genderError && <p className="err">Gender is required</p>}
          <br />
        </div>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            width: "60%",
            margin: "0 auto",
          }}
          className="form-group"
        >
          <input
            type="submit"
            value="Add Patient"
            className="btn btn-primary"
            onClick={handelSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
