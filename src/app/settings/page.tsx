"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAppSettings } from "@/components/AppSettings";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Table from "@/components/Table";
import { updateAppSettings } from "@/lib/firebase/firestore";
import Box from "@mui/material/Box";
import {
  flattenPatient,
  generateSeedData,
  getHeadersFromDataSettings,
  validateField,
} from "@/lib/util";
import Typography from "@mui/material/Typography";
import {
  AppSettings,
  DataField,
  FlatStringPatient,
  StringObj,
} from "@/lib/types";
import Paper from "@/components/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import theme from "@/components/ThemeRegistry/theme";
import TextField from "@mui/material/TextField";
import { Radio, RadioGroup } from "@mui/material";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";

const SettingsPage = () => {
  const appSettings = useAppSettings();

  return (
    <Paper>
      <Typography variant="h4" color="text.primary">
        Settings
      </Typography>
      <PatientDataSettings appSettings={appSettings} />
      <TableHeaderSettings appSettings={appSettings} />
    </Paper>
  );
};

const PatientDataSettings: React.FC<{ appSettings: AppSettings }> = ({
  appSettings,
}) => {
  const { patientDataSettings } = appSettings;
  const [inputValue, setInputValue] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [radioValue, setRadioValue] = useState("text");
  const isFieldValid = useMemo(() => {
    return validateField(inputValue, patientDataSettings);
  }, [inputValue]);

  useEffect(() => {
    if (isButtonClicked && inputValue !== "") {
      setIsButtonClicked(false);
      const newField: DataField = {
        fieldName: inputValue.toLowerCase().split(" ").join("_"),
        displayName: inputValue,
        patientsTableHeaderIndex: -1,
        isRequiredOnPatientForm: false,
        isNonDefaultField: true,
        inputType: radioValue,
      };
      updateAppSettings({
        ...appSettings,
        patientDataSettings: [...patientDataSettings, newField],
      }).then((r) => {
        setInputValue("");
        setRadioValue("text");
      });
    }
  }, [isButtonClicked, inputValue, appSettings]);

  const fieldCancelClick = useMemo(() => {
    return (fieldName: string) => {
      updateAppSettings({
        ...appSettings,
        patientDataSettings: patientDataSettings.filter(
          (data) => data.fieldName !== fieldName
        ),
      }).then((r) => r);
    };
  }, [appSettings]);

  return (
    <Box display="flex" flexDirection="column" flexWrap="wrap">
      <Typography variant="h6" color="primary" mt={3} mb={1}>
        Patient Data Settings
      </Typography>
      <Grid container spacing={1}>
        {patientDataSettings.map((data) => {
          if (data.fieldName !== "address" && data.fieldName !== "id") {
            const typeStr: string = data["inputType"]
              ? `${data["inputType"]}`
              : data.fieldName === "dob"
              ? "date"
              : "text";
            return (
              <Grid xs={2} key={data.fieldName}>
                <span>
                  {data.displayName}{" "}
                  <span style={{ color: theme.palette.primary.main }}>
                    {typeStr}
                  </span>
                  {data["isNonDefaultField"] && (
                    <ClearIcon
                      style={{ height: "12px", cursor: "pointer" }}
                      onClick={() => fieldCancelClick(data.fieldName as string)}
                    />
                  )}
                </span>
              </Grid>
            );
          }
        })}
        <Grid xs={12} key={"add-field"}>
          <Box display="flex" flexDirection="column" width={"20%"} mt={2}>
            <span style={{ color: theme.palette.primary.main }}>
              Add a New Data Field
            </span>
            <TextField
              id="outlined-controlled"
              label="Field name"
              value={inputValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInputValue(event.target.value);
              }}
            />
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="text"
              name="radio-buttons-group"
              value={radioValue}
              onChange={(e) => setRadioValue(e.target.value)}
            >
              <FormControlLabel value="text" control={<Radio />} label="text" />
              <FormControlLabel
                value="number"
                control={<Radio />}
                label="number"
              />
            </RadioGroup>

            <Button
              disabled={!isFieldValid}
              onClick={(e) => setIsButtonClicked(true)}
            >
              Create Field
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const TableHeaderSettings: React.FC<{ appSettings: AppSettings }> = ({
  appSettings,
}) => {
  const { patientDataSettings } = appSettings;
  const [rowItems, setRowItems] = useState<Array<FlatStringPatient>>([]);
  const patients = generateSeedData(3);

  useEffect(() => {
    setRowItems(patients.map(flattenPatient));
  }, [appSettings.timestamp]);

  const handleHeaderChange = async (fieldName: keyof FlatStringPatient) => {
    await updateAppSettings({
      patientDataSettings: patientDataSettings.map((dataSetting) => {
        if (dataSetting.fieldName === fieldName) {
          dataSetting.patientsTableHeaderIndex =
            dataSetting.patientsTableHeaderIndex === -1
              ? Math.max(
                  ...patientDataSettings.map(
                    (data) => data.patientsTableHeaderIndex
                  )
                ) + 1
              : -1;
        }
        return dataSetting;
      }),
      timestamp: undefined,
    });
  };

  const headers: (keyof FlatStringPatient)[] = useMemo(() => {
    return getHeadersFromDataSettings(patientDataSettings);
  }, [patientDataSettings]);

  const headerDisplayNameMap = useMemo(() => {
    const headerDisplayNameMap: StringObj = {};
    patientDataSettings.forEach((field) => {
      headerDisplayNameMap[field.fieldName] = field.displayName;
    });
    return headerDisplayNameMap;
  }, [patientDataSettings]);

  return (
    <Box>
      <Typography
        variant="h6"
        color="primary"
        mt={3}
        mb={1}
        id="patients-table-settings"
      >
        Patients Table Settings
      </Typography>
      <Box display="flex" flexWrap="wrap">
        <Grid container spacing={1}>
          {patientDataSettings.map((dataSetting) =>
            dataSetting.patientsTableHeaderIndex > -2 ? (
              <Grid xs={2} key={dataSetting.fieldName}>
                <FormControlLabel
                  key={dataSetting.fieldName}
                  control={
                    <Switch
                      checked={dataSetting.patientsTableHeaderIndex > -1}
                      onChange={() => handleHeaderChange(dataSetting.fieldName)}
                    />
                  }
                  label={dataSetting.displayName}
                />
              </Grid>
            ) : (
              <></>
            )
          )}
        </Grid>
        <Box minWidth={600}>
          <Table
            isDemoTable
            rowItems={rowItems}
            headers={headers}
            headerDisplayNameMap={headerDisplayNameMap}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
