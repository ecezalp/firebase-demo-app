"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import PatientForm from "@/components/PatientForm";
import { useAppSettings } from "@/components/AppSettings";
import Paper from "@/components/Paper";
import { defaultEmptyPatient } from "@/lib/constants";
import { createPatient } from "@/lib/firebase/firestore";
import { Patient } from "@/lib/types";

const NewPatientPage: React.FC = () => {
  const { patientDataSettings } = useAppSettings();
  const router = useRouter();
  return (
    <Paper>
      <PatientForm
        isNewPatientForm
        initialPatient={defaultEmptyPatient}
        onSubmit={(patient: Patient) =>
          createPatient(patient).then((id) => {
            if (id) router.push(`/patients/${id}`);
          })
        }
        dataSettings={patientDataSettings}
      />
    </Paper>
  );
};

export default NewPatientPage;
