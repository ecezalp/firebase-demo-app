"use client";
import React, { ChangeEvent, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  DataField,
  FormRowProps,
  KeyedDataSettings,
  Patient,
  Status,
} from "@/lib/types";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import { flattenPatient, keyDataSettingsByFieldName } from "@/lib/util";
import Button from "@/components/Button";
import { FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { DateField } from "@mui/x-date-pickers";
import { SelectChangeEvent } from "@mui/material/Select";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import { BUTTON_WIDTH } from "@/lib/constants";
import Box from "@mui/material/Box";

const TextFormItem: React.FC<{
  id: string;
  displayName: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isRequired: boolean;
}> = ({ id, displayName, value, onChange, isRequired }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const isError = isRequired && isInitialized && isBlurred && value === "";
  return (
    <FormControl fullWidth>
      <TextField
        required={isRequired}
        fullWidth
        error={isError}
        key={id}
        id={id}
        label={displayName}
        variant="standard"
        value={value}
        onChange={onChange}
        onFocus={() => {
          setIsInitialized(true);
          setIsBlurred(false);
        }}
        onBlur={() => setIsBlurred(true)}
      />
      {isError && <FormHelperText>Please provide a value</FormHelperText>}
    </FormControl>
  );
};

const DateFormItem: React.FC<{
  value: Date;
  onChange: (e: Date) => void;
}> = ({ value, onChange }) => {
  return (
    <Grid xs={4}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateField"]}>
          <DateField
            fullWidth
            label="Date of Birth"
            value={dayjs(value)}
            onChange={(newValue) => {
              newValue ? onChange(newValue.toDate()) : undefined;
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Grid>
  );
};

const PatientForm: React.FC<{
  isNewPatientForm: boolean;
  initialPatient: Patient;
  onSubmit: (patient: Patient) => void;
  dataSettings: Array<DataField>;
}> = ({ initialPatient, dataSettings, onSubmit, isNewPatientForm }) => {
  const [localPatient, setLocalPatient] = useState<Patient>(initialPatient);
  const rowProps = useMemo(
    () => ({
      localPatient,
      setLocalPatient,
      keyedDataSettings: keyDataSettingsByFieldName(dataSettings),
    }),
    [localPatient, setLocalPatient, dataSettings]
  );
  const isSubmissionValid = isPatientValid(
    localPatient,
    rowProps.keyedDataSettings
  );
  return (
    <>
      <form
        onSubmit={(e) => onSubmit(localPatient)}
        noValidate
        autoComplete="off"
      >
        <Grid container spacing={1}>
          <Grid xs={8}>
            <Typography variant="h4">
              {`${isNewPatientForm ? "New" : "Edit"} Patient Form`}
            </Typography>
          </Grid>
          <Grid xs={4} sx={{ minWidth: BUTTON_WIDTH }}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Button
                sx={{ minWidth: BUTTON_WIDTH }}
                color="success"
                variant="contained"
                disabled={!isSubmissionValid}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(localPatient);
                }}
              >
                Submit
              </Button>
              <Button sx={{ minWidth: BUTTON_WIDTH }} href="/settings/#form">
                Form Settings
              </Button>
            </Box>
          </Grid>
          <Grid xs={12}>
            Please fill out all fields marked with an asterisk (*) to enable the
            Submit button.
          </Grid>
          <TitleRow>Basics</TitleRow>
          <NameRow {...rowProps} />
          <DateSexGenderRow {...rowProps} />
          <StatusPhoneRow {...rowProps} />
          <TitleRow>Addresses</TitleRow>
          <AddressRows {...rowProps} />
          <TitleRow>Additional Information</TitleRow>
          <Grid xs={12} key={"notes"}>
            <TextField
              style={{ width: "100%" }}
              key={"notes"}
              id={"notes"}
              minRows={3}
              label={rowProps.keyedDataSettings["notes"].displayName}
              variant="standard"
              value={localPatient["notes"]}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setLocalPatient({
                  ...localPatient,
                  notes: event.target.value,
                });
              }}
            />
          </Grid>
          {dataSettings.reduce<Array<React.ReactNode>>((acc, dataField) => {
            if (dataField["isNonDefaultField"]) {
              acc.push(
                <Grid xs={4} key={dataField.fieldName}>
                  <TextField
                    key={dataField.fieldName}
                    style={{ width: "100%" }}
                    id={dataField.fieldName as string}
                    label={dataField.displayName}
                    variant="standard"
                    value={localPatient[dataField.fieldName]}
                    type={
                      dataField["inputType"] === "number" ? "number" : "text"
                    }
                    onChange={(
                      event: React.ChangeEvent<HTMLTextAreaElement>
                    ) => {
                      setLocalPatient({
                        ...localPatient,
                        [dataField.fieldName]: event.target.value,
                      });
                    }}
                  />
                </Grid>
              );
            }
            return acc;
          }, [])}
        </Grid>
      </form>
    </>
  );
};

const TitleRow: React.FC<{ children: string }> = ({ children }) => {
  return (
    <>
      <Grid xs={12} />
      <Grid xs={12} key={children}>
        <Typography variant="h6" color="primary">
          {children}
        </Typography>
      </Grid>
    </>
  );
};

const NameRow: React.FC<FormRowProps> = ({
  keyedDataSettings,
  setLocalPatient,
  localPatient,
}) => {
  return ["first_name", "middle_name", "last_name"].map((fieldName) => {
    return (
      <Grid xs={4} key={fieldName}>
        <TextFormItem
          isRequired
          id={fieldName}
          displayName={keyedDataSettings[fieldName].displayName}
          value={localPatient[fieldName] as string}
          onChange={(event: React.ChangeEvent) => {
            setLocalPatient({
              ...localPatient,
              [fieldName]: (event as React.ChangeEvent<HTMLInputElement>).target
                .value,
            });
          }}
        />
      </Grid>
    );
  });
};

const DateSexGenderRow: React.FC<FormRowProps> = ({
  keyedDataSettings,
  setLocalPatient,
  localPatient,
}) => {
  return (
    <>
      <DateFormItem
        value={
          localPatient.dob instanceof Date
            ? localPatient.dob
            : localPatient.dob.toDate()
        }
        onChange={(val) =>
          setLocalPatient({
            ...localPatient,
            dob: val,
          })
        }
      />
      <Grid xs={4} key={"sex"}>
        <TextFormItem
          id={"sex"}
          isRequired
          displayName={keyedDataSettings["sex"].displayName}
          value={localPatient["sex"]}
          onChange={(event) => {
            setLocalPatient({
              ...localPatient,
              ["sex"]: event.target.value,
            });
          }}
        />
      </Grid>
      <Grid xs={4} key={"gender"}>
        <TextFormItem
          id={"gender"}
          isRequired
          displayName={keyedDataSettings["gender"].displayName}
          value={localPatient["gender"] as string}
          onChange={(event: ChangeEvent) => {
            setLocalPatient({
              ...localPatient,
              ["gender"]: (event.target as HTMLInputElement).value,
            });
          }}
        />
      </Grid>
    </>
  );
};

const StatusPhoneRow: React.FC<FormRowProps> = ({
  keyedDataSettings,
  setLocalPatient,
  localPatient,
}) => {
  return (
    <>
      <Grid xs={4} key={"status"}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="status"
            id="status"
            value={localPatient.status}
            label="Age"
            onChange={(e: SelectChangeEvent) =>
              setLocalPatient({
                ...localPatient,
                status: e.target.value as Status,
              })
            }
          >
            <MenuItem value={Status.Inquiry}>{Status.Inquiry}</MenuItem>
            <MenuItem value={Status.Onboarding}>{Status.Onboarding}</MenuItem>
            <MenuItem value={Status.Active}>{Status.Active}</MenuItem>
            <MenuItem value={Status.Inactive}>{Status.Inactive}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={4} key={"phone"}>
        <TextFormItem
          id={"phone"}
          isRequired
          displayName={keyedDataSettings["phone"].displayName}
          value={localPatient["phone"] as string}
          onChange={(event: React.ChangeEvent) => {
            setLocalPatient({
              ...localPatient,
              ["phone"]: (event.target as HTMLInputElement).value,
            });
          }}
        />
      </Grid>
    </>
  );
};

const AddressRows: React.FC<FormRowProps> = ({
  keyedDataSettings,
  setLocalPatient,
  localPatient,
}) => {
  return [0, 1].map((i) => {
    return ["street", "city", "state", "zip"].map((fieldName) => {
      return (
        <Grid xs={3} key={`${!i ? "primary" : "mailing"}-${fieldName}`}>
          <TextFormItem
            isRequired={!i}
            id={fieldName}
            displayName={`${!i ? `Primary` : `Mailing`} ${
              keyedDataSettings[fieldName].displayName
            }`}
            value={localPatient["addresses"][i][fieldName] as string}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLocalPatient({
                ...localPatient,
                addresses: localPatient.addresses.with(i, {
                  ...localPatient.addresses[i],
                  [fieldName]: event.target.value,
                }),
              });
            }}
          />
        </Grid>
      );
    });
  });
};

const isPatientValid = (
  patient: Patient,
  keyedDataSettings: KeyedDataSettings
): boolean => {
  const flatPatient = flattenPatient(patient);
  const flatKeys = Object.keys(flatPatient);
  if (flatKeys.length === 0) return false;
  for (let i = 0; i < flatKeys.length; i++) {
    if (
      flatKeys[i] !== "id" &&
      flatKeys[i] !== "timestamp" &&
      flatKeys[i] !== "is_seed" &&
      keyedDataSettings[flatKeys[i]] &&
      keyedDataSettings[flatKeys[i]].isRequiredOnPatientForm &&
      flatPatient[flatKeys[i]] == ""
    ) {
      return false;
    }
  }
  return true;
};

export default PatientForm;
