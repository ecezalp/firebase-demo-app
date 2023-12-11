import React from "react";
import Link from "next/link";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";
import { DRAWER_WIDTH, DRAWER_ICON_WIDTH } from "@/lib/constants";
import { ListItemButtonProps } from "@mui/material/ListItemButton/ListItemButton";

const TOP_LINKS = [
  { text: "Calendar", icon: CalendarMonthIcon },
  { text: "Patients", href: "/patients", icon: Diversity1Icon },
  { text: "Employees", icon: Diversity3Icon },
  { text: "Billing", icon: ReceiptIcon },
  { text: "Messages", icon: EmailIcon },
];

const BOTTOM_LINKS = [
  { text: "Settings", icon: SettingsIcon, href: "/settings" },
  { text: "Support", icon: SupportIcon },
];

const getButtonProps = (
  href: string | undefined
): ListItemButtonProps & { href: string | undefined } => {
  const buttonProps: ListItemButtonProps & { href: string | undefined } = {
    href: undefined,
  };
  if (href) {
    buttonProps["component"] = Link;
    buttonProps["href"] = href;
  } else {
    buttonProps["disabled"] = true;
  }
  return buttonProps;
};

const DrawerComponent: React.FC<{}> = () => (
  <Drawer
    sx={{
      width: DRAWER_WIDTH,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: DRAWER_WIDTH,
        boxSizing: "border-box",
        top: ["48px", "58px", "64px"],
        height: "auto",
        bottom: 0,
      },
      "& .MuiListItemIcon-root": {
        minWidth: DRAWER_ICON_WIDTH,
      },
    }}
    variant="permanent"
    anchor="left"
  >
    <Divider />
    <List>
      {TOP_LINKS.map(({ text, href, icon: Icon }) => {
        return (
          <ListItem key={text} disablePadding>
            <ListItemButton {...getButtonProps(href)}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
    <Divider sx={{ mt: "auto" }} />
    <List>
      {BOTTOM_LINKS.map(({ text, href, icon: Icon }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton {...getButtonProps(href)}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default DrawerComponent;
