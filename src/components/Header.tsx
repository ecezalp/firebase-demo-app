"use client";

import React from "react";
import { signOut } from "@/lib/firebase/auth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { User } from "firebase/auth";
import Box from "@mui/material/Box";
import { createSeedData, deleteSeedData } from "@/lib/firebase/firestore";
import Button from "@mui/material/Button";

const handleSignOut = (
  event:
    | React.MouseEvent<HTMLAnchorElement>
    | React.MouseEvent<HTMLButtonElement>
) => {
  event.preventDefault();
  signOut().then((r) => r);
};

const Header: React.FC<{ user: User }> = ({ user }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Box display="flex">
            <Typography variant="h6" color="text.primary">
              {`${user.displayName || "Anon"}'s Clinic`}
            </Typography>
          </Box>
          <Box display="flex">
            <Box marginRight="30px">
              <Button
                onClick={() => {
                  createSeedData().then((r) => r);
                }}
              >
                Seed Data
              </Button>
              <Button
                onClick={() => {
                  deleteSeedData().then((r) => r);
                }}
              >
                Clear Data
              </Button>
            </Box>
            <Button variant="outlined" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
