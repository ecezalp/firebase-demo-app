"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { getCurrentUserId } from "@/lib/firebase/auth";
import { AppSettings, Patient } from "@/lib/types";
import { generateSeedData } from "@/lib/util";

export async function listenAppSettings(
  userId: string,
  updateCallback: (settings: AppSettings) => void
): Promise<() => void> {
  let q = query(
    collection(db, `users/${userId}/settings`),
    orderBy("timestamp", "desc"), // Order by timestamp in descending order
    limit(1) // Limit the result to the latest document
  );

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
      };
    });
    if (results.length === 1) {
      updateCallback(results[0] as AppSettings);
    }
  });
}

export async function updateAppSettings(data: AppSettings) {
  try {
    const userId = await getCurrentUserId();
    const settingsCollectionRef = collection(db, `users/${userId}/settings`);
    await addDoc(settingsCollectionRef, {
      ...data,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

export async function createSeedData() {
  const data = generateSeedData(20);
  const userId = await getCurrentUserId();
  if (userId) {
    for (let patient of data) {
      await createPatientWithUserId(
        {
          ...patient,
          is_seed: true,
        },
        userId
      );
    }
  }
}

export async function createPatient(patient: Patient): Promise<string> {
  const userId = await getCurrentUserId();
  if (userId) {
    return await createPatientWithUserId(patient, userId);
  }
  return "";
}

export async function createPatientWithUserId(
  patient: Patient,
  userId: string
): Promise<string> {
  try {
    const collectionRef = collection(db, `users/${userId}/patients`);
    const createdPatient = await addDoc(collectionRef, {
      ...patient,
      timestamp: serverTimestamp(),
    });
    return createdPatient.id;
  } catch (e) {
    console.error("Error updating document: ", e);
  }
  return "";
}

export async function deleteSeedData() {
  const userId = await getCurrentUserId();
  const existingData = await getDocs(
    collection(db, `users/${userId}/patients`)
  );
  for (const doc of existingData.docs) {
    try {
      if (doc.data().is_seed) {
        await deleteDoc(doc.ref);
      }
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }
}

export async function listenPatients(
  updateCallback: (patients: Array<Patient>) => void,
  filters = {}
): Promise<() => void> {
  const userId = await getCurrentUserId();
  let q = query(collection(db, `users/${userId}/patients`));
  q = applyQueryFilters(q, filters);
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    updateCallback(results as Patient[]);
  });
}

export async function readPatient(id: string): Promise<Patient | undefined> {
  try {
    const userId = await getCurrentUserId();
    const docRef = doc(db, `users/${userId}/patients/${id}`);
    const docSnap = await getDoc(docRef);
    const patient = docSnap.data();
    if (patient) {
      return patient as Patient;
    }
    return undefined;
  } catch (e) {
    console.error(`Error fetching patient ${id}: `, e);
  }
}

export async function updatePatient(
  id: string,
  patient: Patient
): Promise<string> {
  try {
    const userId = await getCurrentUserId();
    const docRef = doc(db, `users/${userId}/patients/${id}`);
    await updateDoc(docRef, patient);
    return id;
  } catch (e) {
    console.error(`Error updating patient ${id}: `, e);
  }
  return "";
}

function applyQueryFilters(
  q: Query,
  { firstName, lastName }: Partial<{ firstName: string; lastName: string }>
) {
  if (firstName) {
    q = query(q, where("first_name", "==", firstName));
  }
  if (lastName) {
    q = query(q, where("last_name", "==", lastName));
  }
  return q;
}
