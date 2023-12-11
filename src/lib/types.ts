import { Timestamp, FieldValue } from "firebase/firestore";

export type {
  Patient,
  Order,
  AppSettings,
  Address,
  Field,
  DataField,
  FlatStringPatient,
  FormRowProps,
  KeyedDataSettings,
  StringObj,
};

export enum Status {
  Active = "active",
  Inactive = "inactive",
  Inquiry = "inquiry",
  Onboarding = "onboarding",
}

interface AppSettings {
  patientDataSettings: Array<DataField>;
  timestamp: FieldValue | undefined;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  is_primary: boolean;
  [key: string]: string | boolean;
}

interface Patient {
  addresses: Array<Address>;
  dob: Timestamp | Date;
  first_name: string;
  gender: string;
  id: string;
  last_name: string;
  middle_name: string;
  notes: string;
  phone: string;
  sex: string;
  status: Status;
  [key: string]: Timestamp | Date | Status | Array<Address> | string | boolean;
}

// type Flatten<T> = T extends Record<string, any>
//     ? { [K in keyof T]: Flatten<T[K]> } & { [K in keyof T]: string }
//     : never;
//
// type ExcludeKeys<T, K> = {
//   [P in keyof T]: P extends K ? never : T[P];
// };
//
// type ExcludeNestedKeys<T, K> = T extends Record<string, any>
//     ? ExcludeKeys<T, K> & { [P in keyof T]: ExcludeNestedKeys<T[P], K> }
//     : string;
//
// type FlatStringPatient = ExcludeNestedKeys<Flatten<Patient>, 'id' | 'is_primary'>;
interface FlatStringPatient {
  address: string; // primary address for table
  city: string; // primary city for table
  dob: string;
  first_name: string;
  gender: string;
  id: string;
  last_name: string;
  middle_name: string;
  notes: string;
  phone: string;
  sex: string;
  state: string; // primary state for table
  status: string;
  street: string; // primary street for table
  zip: string; // primary zip for table
  [key: string]: string;
}

type DataField = {
  fieldName: keyof FlatStringPatient;
  displayName: string;
  patientsTableHeaderIndex: number;
  isRequiredOnPatientForm: boolean;
  [key: string]: string | ((rawData: Field) => string) | number | boolean;
};

type Field = string | Array<Address> | Timestamp | boolean | number | Status;
type Order = "asc" | "desc";

type FormRowProps = {
  keyedDataSettings: KeyedDataSettings;
  localPatient: Patient;
  setLocalPatient: (newPatient: Patient) => void;
};

type KeyedDataSettings = { [key: string]: DataField };

type StringObj = { [key: string]: string };
