import { Address, DataField, Patient, Status, Field } from "@/lib/types";
import { Timestamp } from "firebase/firestore";
import { flattenPatient } from "@/lib/util";

export { DRAWER_WIDTH, DRAWER_ICON_WIDTH, HEADER_HEIGHT, BUTTON_WIDTH };
export { defaultEmptyPatient, defaultFields };

const DRAWER_WIDTH = 200;
const DRAWER_ICON_WIDTH = 40;
const HEADER_HEIGHT = 66;
const BUTTON_WIDTH = 130;

export const defaultEmptyAddress: Address = {
  city: "",
  is_primary: true,
  state: "",
  street: "",
  zip: "",
};

const defaultEmptyPatient: Patient = {
  addresses: [
    defaultEmptyAddress,
    { ...defaultEmptyAddress, is_primary: false },
  ],
  dob: new Timestamp(0, 0),
  first_name: "",
  gender: "",
  id: "",
  last_name: "",
  middle_name: "",
  notes: "",
  phone: "",
  sex: "",
  status: Status.Inquiry,
};

const defaultFields: Array<DataField> = [
  <DataField>{
    displayName: "First Name",
    fieldName: "first_name",
    patientsTableHeaderIndex: 0,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Middle Name",
    fieldName: "middle_name",
    patientsTableHeaderIndex: 1,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Last Name",
    fieldName: "last_name",
    patientsTableHeaderIndex: 2,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Status",
    fieldName: "status",
    patientsTableHeaderIndex: 3,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Date of Birth",
    fieldName: "dob",
    patientsTableHeaderIndex: 4,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Primary Address",
    fieldName: "address",
    patientsTableHeaderIndex: 5,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Sex",
    fieldName: "sex",
    patientsTableHeaderIndex: -1,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Gender",
    fieldName: "gender",
    patientsTableHeaderIndex: -1,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Phone Number",
    fieldName: "phone",
    patientsTableHeaderIndex: -1,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Notes",
    fieldName: "notes",
    patientsTableHeaderIndex: -1,
    isRequiredOnPatientForm: false,
  },
  <DataField>{
    displayName: "Street",
    fieldName: "street",
    patientsTableHeaderIndex: -1,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "City",
    fieldName: "city",
    patientsTableHeaderIndex: -1,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "State",
    fieldName: "state",
    patientsTableHeaderIndex: -1,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "Zip Code",
    fieldName: "zip",
    patientsTableHeaderIndex: -1,
    isRequiredOnPatientForm: true,
  },
  <DataField>{
    displayName: "",
    fieldName: "id",
    patientsTableHeaderIndex: -2,
    isRequiredOnPatientForm: false,
  },
];
