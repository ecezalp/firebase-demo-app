import React from "react";
import Box from "@mui/material/Box";

const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    display="flex"
    flexDirection="column"
    width="100%"
    margin="20px"
    padding="20px"
    bgcolor={(theme) => theme.palette.background.paper}
  >
    {children}
  </Box>
);

export default Paper;
