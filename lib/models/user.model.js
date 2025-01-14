import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String }, // Unique identifier
    plaintiff: {
        fName: { type: String, required: true },
        lName: { type: String },
        mName: { type: String },
        maidenName: { type: String },
        nameChange: { type: Boolean, default: false },
        address: {
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipcode: { type: String, required: true },
        },
        dateOfBirth: { type: Date, required: true },
        placeOfBirth: {
            city: { type: String },
            state: { type: String },
            zipcode: { type: String },
        },
        mobile: { type: String, required: true }, // Changed type to String for consistency
    },
    defendant: {
        fName: { type: String, required: true },
        lName: { type: String },
        mName: { type: String },
        maidenName: { type: String },
        address: {
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipcode: { type: String, required: true },
        },
        dateOfBirth: { type: Date, required: true },
        mobile: { type: String, required: true }, // Changed type to String for consistency
        fault: { type: String },
    },
    marriageDetails: {
        dateOfMarriage: { type: Date },
        cityOfMarriage: { type: String },
        dateOfSeparation: { type: Date },
    },
    childrenDetails: {
        noOfChildren: { type: Number },
        children: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],
        physicalCustody: { type: String },
        legalCustody: { type: String },
        visitationLimitation: { type: String },
        childSupport: { type: String },
    },
    supportDetails: {
        amount: { type: Number },
        duration: { type: String },
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
            }
        ],
        personalProperty: {
            defendant: { type: String },
            plaintiff: { type: String },
            additionalDetails: { type: String },
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
    driversLicense: {
        number: { type: String },
        stateOfIssue: { type: String },
    },
    vehicleDetails: {
        plate: { type: String },
        make: { type: String },
        year: { type: String },
        model: { type: String },
    },
    employerDetails: {
        name: { type: String },
        contact: { type: String },
        address: { type: String },
    },
    licenses: {
        hasLicense: { type: Boolean },
        details: { type: String },
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
        zipcode: { type: String },
        notes: { type: String },
    },
    serviceFee: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
