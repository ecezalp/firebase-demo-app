import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import config from "@/lib/firebase/config";

export const firebaseConfig = config;
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const appAuth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
