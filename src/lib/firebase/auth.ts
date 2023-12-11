import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
} from "firebase/auth";

import { appAuth } from "@/lib/firebase/firebase";

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(appAuth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(appAuth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return appAuth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}

export async function getCurrentUserId() {
  const user = appAuth.currentUser;
  if (user) {
    return user.uid;
  } else {
    console.error("Authenticated user not found");
  }
}
