const mongoose = require("mongoose");
var mongooseTypePhone = require('mongoose-type-phone');
const validator = require('mongoose-validator')
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    temperature: {
      type: Number,
      required: true,
      maxlength: 2,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    phone_number: {
      type: mongooseTypePhone.PhoneNumberType,
      trim: true,
      required: true,
    },
    nationality: {
      type: String,
      trim: true,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
    country_code_iso3: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
