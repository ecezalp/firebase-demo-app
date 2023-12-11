import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { BUTTON_WIDTH } from "@/lib/constants";

const WideButton = styled(Button)({
  width: BUTTON_WIDTH,
  "&:disabled": {
    backgroundColor: "#808080",
    borderColor: "#808080",
    boxShadow: "none",
  },
});

export default WideButton;
