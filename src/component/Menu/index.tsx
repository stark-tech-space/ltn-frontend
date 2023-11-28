import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { ROUTES } from "../../router";
import { useNavigate } from "react-router-dom";

interface LinkTabProps {
  label?: string;
  href: string;
}

function samePageLinkNavigation(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props: LinkTabProps) {
  const navigator = useNavigate();

  return (
    <Tab
      component="a"
      sx={{
        "&.Mui-selected": {
          color: "#405DF9 !important",
        },
        fontSize: "16px",
        fontWeight: 400,
      }}
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
          navigator(props.href);
        }
      }}
      {...props}
    />
  );
}

export default function NavTabs() {
  const [value, setValue] = React.useState(() => {
    return ROUTES.findIndex((item) => item.path === window.location.pathname);
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (
      event.type !== "click" ||
      (event.type === "click" &&
        samePageLinkNavigation(
          event as React.MouseEvent<HTMLAnchorElement, MouseEvent>
        ))
    ) {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ px: 6, bgcolor: "#fff", mt: 1 }}>
      <Tabs value={value} onChange={handleChange}>
        {ROUTES.map((item, index) => {
          return <LinkTab key={index} label={item.title} href={item.path} />;
        })}
      </Tabs>
    </Box>
  );
}
