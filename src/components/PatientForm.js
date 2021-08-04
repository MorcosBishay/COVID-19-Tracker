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
  const nationalityOptions = useMemo(() => countryList().getData(), []);

  const changeNationalityHandler = (value) => {
    setNationality(value);
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
      gender: data.gender,
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
  };

  return (
    <div className="container">
      <h3>Add New Patient</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
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
          <label>Nationality *</label>
          <Select
            options={nationalityOptions}
            value={nationality}
            onChange={changeNationalityHandler}
            className="form-control"
          />
          <p className="err">{errors.nationality?.message}</p>
          <label>Weight (kg) *</label>
          <input className="form-control" {...register("weight")} />
          <p className="err">{errors.weight?.message}</p>
          <label>Gender *</label>
          <select
            defaultValue=""
            className="form-control"
            {...register("gender")}
          >
            <option value="" disabled></option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <p className="err">{errors.gender?.message}</p>
          <br />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Add Patient"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
