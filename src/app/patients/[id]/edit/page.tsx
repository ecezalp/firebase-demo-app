"use client";
import * as React from "react";
import { useAppSettings } from "@/components/AppSettings";
import { useEffect, useState } from "react";
import { Patient } from "@/lib/types";
import Paper from "@/components/Paper";
import PatientForm from "@/components/PatientForm";
import { updatePatient, readPatient } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";

const EditPatientPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const appSettings = useAppSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<Patient>();
  let router = useRouter();

  useEffect(() => {
    readPatient(params.id).then((patient) => {
      setPatient(patient);
      setIsLoading(false);
    });
  }, [params.id]);

  return (
    <Paper>
      {patient && (
        <PatientForm
          initialPatient={patient}
          onSubmit={(patient: Patient) =>
            updatePatient(params.id, patient).then((id) => {
              if (id) router.push(`/patients/${id}`);
            })
          }
          dataSettings={appSettings.patientDataSettings}
          isNewPatientForm={false}
        />
      )}
    </Paper>
  );
};

export default EditPatientPage;
