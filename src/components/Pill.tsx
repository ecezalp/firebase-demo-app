import * as React from "react";
import Chip from "@mui/material/Chip";
import { Status } from "@/lib/types";

const Pill: React.FC<{ status: Status | string }> = ({ status }) => (
  <Chip
    size="small"
    label={status}
    color={
      status === "active"
        ? "success"
        : status === "inactive"
        ? "secondary"
        : "primary"
    }
    variant={status === "inquiry" ? "outlined" : undefined}
    sx={status === "inactive" ? { bgcolor: "#808080", color: "white" } : {}}
  />
);

export default Pill;
