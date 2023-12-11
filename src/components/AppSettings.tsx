"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppSettings } from "@/lib/types";
import { listenAppSettings } from "@/lib/firebase/firestore";
import { defaultFields } from "@/lib/constants";

const appSettingsInitialValue: AppSettings = {
  patientDataSettings: defaultFields,
  timestamp: undefined,
};

const AppSettingsContext = createContext(appSettingsInitialValue);

export const useAppSettings = () => {
  return useContext(AppSettingsContext);
};

export const AppSettingsProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
}> = ({ children, userId }) => {
  const [appSettings, setAppSettings] = useState<AppSettings>(
    appSettingsInitialValue
  );

  useEffect(() => {
    let unsubscribe = () => {};
    if (userId) {
      unsubscribe();
      listenAppSettings(userId, (data) => {
        if (data) {
          setAppSettings(data);
        }
      }).then((r) => {
        unsubscribe = r;
      });
    }
    return () => {
      unsubscribe();
    };
  }, [userId]);

  return (
    <AppSettingsContext.Provider value={{ ...appSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
