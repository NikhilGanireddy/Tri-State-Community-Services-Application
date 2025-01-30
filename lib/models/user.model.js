import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  plaintiff: {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String },
    maidenName: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    dob: { type: Date },
    mobile: { type: String },
    placeOfBirth: { type: String },
  },
  defendant: {
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    maidenName: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    dob: { type: Date },
    mobile: { type: String },
    placeOfBirth: { type: String },
  },
  marriage: {
    dateOfMarriage: { type: Date },
    cityOfMarriage: { type: String },
    stateOfMarriage: { type: String },
    dateOfSeparation: { type: Date },
  },
  children: {
    count: { type: Number, default: 1 },
    details: [
      {
        id: { type: String },
        name: { type: String },
        dob: { type: Date },
        placeOfBirth: { type: String },
        ssn: { type: String },
        sex: { type: String },
      },
    ],
  },
  custody: {
    physicalCustody: { type: String },
    legalCustody: { type: String },
    visitationLimitation: { type: String },
    childSupport: { type: String },
    supportAmount: { type: String },
    supportFrequency: { type: String },
  },
  courtDecision: {
    previous: {
      docketNumber: { type: String },
      caseName: { type: String },
      county: { type: String },
    },
    current: {
      docketNumber: { type: String },
      caseName: { type: String },
      county: { type: String },
    },
  },
  realEstateDetails: {
    properties: [
      {
        description: { type: String },
        equity: { type: String },
      },
    ],
    personalProperty: {
      defendant: { type: String },
      plaintiff: { type: String },
    },
  },
  insurance: {
    hasInsurance: { type: Boolean },
    details: {
      life: {
        company: { type: String },
        policy: { type: String },
      },
      auto: {
        company: { type: String },
        policy: { type: String },
      },
      health: {
        company: { type: String },
        policy: { type: String },
        group: { type: String },
        throughEmployment: { type: Boolean },
      },
      homeowners: {
        company: { type: String },
        policy: { type: String },
      },
    },
  },
  licenses: {
    driversLicense: {
      number: { type: String },
      stateOfIssue: { type: String },
    },
    employerDetails: {
      name: { type: String },
      contact: { type: String },
      address: { type: String },
    },
    professionalLicense: {
      details: { type: String },
    },
  },
  biographicDetails: {
    gender: { type: String },
    race: { type: String },
    height: { type: String },
    weight: { type: String },
    eyeColor: { type: String },
    hairColor: { type: String },
  },
  referralSource: {
    media: { type: String },
    nameOfMedia: { type: String },
  },
  sheriffAddress: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    notes: { type: String },
  },
  serviceFee: { type: String },
  dateCreated: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
