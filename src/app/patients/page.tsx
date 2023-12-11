"use client";

import React, { useState, useEffect, useMemo } from "react";
import { listenPatients } from "@/lib/firebase/firestore";
import { FlatStringPatient, StringObj } from "@/lib/types";
import Table from "@/components/Table";
import { useAppSettings } from "@/components/AppSettings";
import { flattenPatient, getHeadersFromDataSettings } from "@/lib/util";
import Paper from "@/components/Paper";

const PatientsPage: React.FC = () => {
  const appSettings = useAppSettings();
  const { patientDataSettings, timestamp } = appSettings;
  const [rowItems, setRowItems] = useState<Array<FlatStringPatient>>([]);

  let unsubscribe = () => {};
  useEffect(() => {
    listenPatients((data) => {
      setRowItems(data.map(flattenPatient));
    }, {}).then((r) => {
      unsubscribe = r;
    });
    return () => {
      unsubscribe();
    };
  }, [patientDataSettings]);

  const headerDisplayNameMap = useMemo(() => {
    const headerDisplayNameMap: StringObj = {};
    patientDataSettings.forEach((field) => {
      headerDisplayNameMap[field.fieldName] = field.displayName;
    });
    return headerDisplayNameMap;
  }, [patientDataSettings]);

  const headers: (keyof FlatStringPatient)[] = useMemo(() => {
    return getHeadersFromDataSettings(patientDataSettings);
  }, [patientDataSettings]);

  return (
    <Paper>
      <Table
        headerDisplayNameMap={headerDisplayNameMap}
        rowItems={rowItems}
        headers={headers}
      />
    </Paper>
  );
};

export default PatientsPage;
