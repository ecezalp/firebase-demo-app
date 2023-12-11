"use client";

import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged, signInWithGoogle } from "@/lib/firebase/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Backdrop, CircularProgress } from "@mui/material";
import Header from "./Header";
import Drawer from "@/components/Drawer";
import { AppSettingsProvider } from "@/components/AppSettings";
import { DRAWER_WIDTH, HEADER_HEIGHT } from "@/lib/constants";
import { useRouter } from "next/navigation";

const handleSignIn = () => {
  signInWithGoogle().then((r) => r);
};

const Body: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      onAuthStateChanged((authUser) => {
        if (user === undefined) return;
        if (user?.email !== authUser?.email) {
          router.refresh();
        }
      });
    }
  }, [user, loading, router]);

  return (
    <AppSettingsProvider userId={user?.uid || ""}>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!loading && !user && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          style={{
            backgroundImage:
              "url(https://i.etsystatic.com/23175541/r/il/aca333/2881793676/il_794xN.2881793676_rv1v.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundColor: "white",
          }}
        >
          <Button onClick={handleSignIn} variant="contained">
            Sign In
          </Button>
        </Box>
      )}
      {user && (
        <>
          <Header user={user} />
          <Drawer />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={`calc(100vh-${HEADER_HEIGHT}px)`}
            minWidth={`calc(100vw-${DRAWER_WIDTH}px)`}
            marginLeft={`${DRAWER_WIDTH}px`}
            marginTop={`${HEADER_HEIGHT}px`}
          >
            {children}
          </Box>
        </>
      )}
    </AppSettingsProvider>
  );
};

export default Body;
