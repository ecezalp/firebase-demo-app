import {
  Address,
  Order,
  Patient,
  Status,
  FlatStringPatient,
  DataField,
  KeyedDataSettings,
  StringObj,
} from "@/lib/types";
import { faker } from "@faker-js/faker";
import { Timestamp } from "firebase/firestore";
import { defaultEmptyAddress, defaultEmptyPatient } from "@/lib/constants";

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: string }, b: { [key in Key]: string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function getPaddedRows(
  rows: Array<{ [key: string]: string }>,
  orderBy: string
) {
  return rows.map((row) => ({
    ...row,
    [orderBy]: typeof row[orderBy] === "undefined" ? "" : row[orderBy],
  }));
}

export function stableSort<T>(
  array: readonly Partial<T>[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const generateSecondaryAddress = (): Address => ({
  city: faker.location.city(),
  state: faker.location.state({
    abbreviated: true,
  }),
  is_primary: false,
  zip: faker.location.zipCode(),
  street: faker.location.streetAddress(),
});

export function generateSeedData(count: number): Array<Patient> {
  const data: Array<Patient> = [];
  for (let i = 0; i < count; i++) {
    const patient: Patient = {
      addresses: [
        {
          ...generateSecondaryAddress(),
          is_primary: true,
        },
      ],
      dob: faker.date.birthdate(),
      first_name: faker.person.firstName(),
      gender: faker.person.gender(),
      id: faker.string.uuid(),
      last_name: faker.person.lastName(),
      middle_name: faker.person.firstName(),
      notes: faker.lorem.paragraphs({ min: 1, max: 6 }, "\n\n"),
      phone: faker.phone.number(),
      sex: faker.person.sex(),
      status:
        i % 4 === 0
          ? Status.Active
          : i % 3 === 0
          ? Status.Inquiry
          : i % 2 === 0
          ? Status.Inactive
          : Status.Onboarding,
    };
    if (i % 5 === 0) {
      patient.addresses = [
        ...patient.addresses,
        {
          ...generateSecondaryAddress(),
        },
      ];
    } else {
      patient.addresses = [
        ...patient.addresses,
        { ...defaultEmptyAddress, is_primary: false },
      ];
    }
    data.push(patient);
  }
  return data;
}

export const validateField = (
  input: string,
  patientDataSettings: Array<DataField>
): boolean => {
  if (input.trim().length === 0) return false;
  if (input.length > 20) return false;
  const newFieldDisplayName = input;
  const newFieldFieldName = input.toLowerCase().split(" ").join("_");
  for (let i = 0; i < patientDataSettings.length; i++) {
    if (patientDataSettings[i].fieldName === newFieldFieldName) return false;
    if (patientDataSettings[i].displayName === newFieldDisplayName)
      return false;
  }
  return true;
};

const dateTransform = (rawData: Timestamp | Date): string => {
  let date = rawData instanceof Date ? rawData : rawData.toDate();
  if (rawData instanceof Timestamp) {
    const dateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return dateString.length > 0 ? dateString : "-";
  }
  return "-";
};

export const getHeadersFromDataSettings = (
  patientDataSettings: Array<DataField>
): Array<keyof FlatStringPatient> => {
  return patientDataSettings
    .filter((item) => item.patientsTableHeaderIndex > -1)
    .sort((a: DataField, b: DataField) =>
      a.patientsTableHeaderIndex > b.patientsTableHeaderIndex ? 1 : -1
    )
    .map((item) => item.fieldName);
};

export const flattenPatient = ({
  addresses,
  id,
  dob,
  first_name,
  last_name,
  gender,
  middle_name,
  notes,
  phone,
  state,
  status,
  sex,
  ...nonDefaultFields
}: Patient): FlatStringPatient => {
  let flatPatient: FlatStringPatient = <FlatStringPatient>{
    id,
    first_name,
    last_name,
    gender,
    middle_name,
    notes,
    phone,
    status,
    sex,
    dob: dateTransform(dob),
    address: "-",
    city: "-",
    state: "-",
    street: "-",
    zip: "-",
  };

  const primaryAddress = addresses.find((address) => address.is_primary);
  if (primaryAddress) {
    flatPatient = {
      ...flatPatient,
      address: flattenAddress(primaryAddress),
      city: primaryAddress.city,
      state: primaryAddress.state,
      zip: primaryAddress.zip,
      street: primaryAddress.street,
    };
  }

  if (Object.keys(nonDefaultFields).length > 0) {
    flatPatient = {
      ...flatPatient,
      ...extraFieldsOnPatient(nonDefaultFields),
    };
  }

  return flatPatient;
};

export const flattenAddress = (address: Address | undefined) => {
  if (
    typeof address === "undefined" ||
    (address.street === "" &&
      address.city === "" &&
      address.state === "" &&
      address.zip === "")
  ) {
    return "";
  }
  return `${address.street} ${address.city},${address.state} ${address.zip}`;
};

export const extraFieldsOnPatient = ({
  addresses,
  id,
  dob,
  first_name,
  last_name,
  gender,
  middle_name,
  notes,
  phone,
  state,
  status,
  sex,
  ...nonDefaultFields
}: Partial<Patient>): StringObj =>
  Object.keys(nonDefaultFields).reduce<StringObj>((acc, key) => {
    return {
      ...acc,
      [key]: `${nonDefaultFields[key]}`,
    };
  }, {});

export const keyDataSettingsByFieldName = (
  dataSettings: Array<DataField>
): KeyedDataSettings => {
  const keyedSettings: KeyedDataSettings = {};
  dataSettings.forEach((setting) => {
    keyedSettings[setting.fieldName] = setting;
  });
  return keyedSettings;
};

export const flatEmptyPatient = flattenPatient(defaultEmptyPatient);
