"use client";
import * as React from "react";
import { Patient } from "@/lib/types";
import { useEffect, useState } from "react";
import { readPatient } from "@/lib/firebase/firestore";
import { Backdrop, CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import Pill from "@/components/Pill";
import { flattenAddress, flattenPatient } from "@/lib/util";
import Grid from "@mui/material/Unstable_Grid2";
import { BUTTON_WIDTH } from "@/lib/constants";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { useAppSettings } from "@/components/AppSettings";

const PatientPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<Patient>();
  let router = useRouter();
  const { patientDataSettings } = useAppSettings();

  useEffect(() => {
    readPatient(params.id).then((patient) => {
      setPatient(patient);
      setIsLoading(false);
    });
  }, [params.id]);

  return (
    <Paper>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!isLoading && !patient && <div>Unable to find patient.</div>}
      {patient && (
        <Grid container spacing={3}>
          <Grid xs={10}>
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <Typography variant="h4">
                {patient.first_name} {patient.middle_name} {patient.last_name}
              </Typography>
              <Box marginLeft={1}>
                <Pill status={patient.status} />
              </Box>
            </Box>
          </Grid>
          <Grid xs={2} sx={{ minWidth: BUTTON_WIDTH }}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Button
                sx={{ minWidth: BUTTON_WIDTH }}
                color="success"
                variant="contained"
                onClick={() => {
                  router.push(`/patients/${params.id}/edit`);
                }}
              >
                Edit Patient
              </Button>
            </Box>
          </Grid>
          <Grid xs={2}>
            <Typography color={"primary"}>Date of Birth</Typography>
            {flattenPatient(patient).dob}
          </Grid>
          <Grid xs={2}>
            <Typography color={"primary"}>Sex</Typography>
            {patient.sex}
          </Grid>
          <Grid xs={2}>
            <Typography color={"primary"}>Gender</Typography>
            {patient.gender}
          </Grid>
          <Grid xs={2}>
            <Typography color={"primary"}>Phone</Typography>
            {patient.phone}
          </Grid>
          <Grid xs={6}>
            <Typography color={"primary"}>Primary Address</Typography>
            {flattenAddress(
              patient.addresses.find((address) => address.is_primary)
            )}
          </Grid>
          {flattenAddress(
            patient.addresses.find((address) => !address.is_primary)
          ).length > 0 ? (
            <Grid xs={6}>
              <Typography color={"primary"}>Mailing Address</Typography>
              {flattenAddress(
                patient.addresses.find((address) => !address.is_primary)
              )}
            </Grid>
          ) : (
            <></>
          )}
          <Grid xs={12}>
            <Typography color={"primary"}>Notes</Typography>
            {patient.notes}
          </Grid>
          {patientDataSettings.reduce<Array<React.ReactNode>>(
            (acc, dataField) => {
              if (
                dataField["isNonDefaultField"] &&
                patient[dataField.fieldName]
              ) {
                acc.push(
                  <Grid xs={2}>
                    <Typography color={"primary"}>
                      {dataField.displayName}
                    </Typography>
                    {`${patient[dataField.fieldName]}`}
                  </Grid>
                );
              }
              return acc;
            },
            []
          )}
        </Grid>
      )}
    </Paper>
  );
};

export default PatientPage;
