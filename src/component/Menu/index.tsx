import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Button, Divider, useMediaQuery, useTheme } from "@mui/material";
import { ROUTES } from "../../router";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentPageRouteState,
  openMobileNavigationDrawerState,
} from "recoil/atom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const currentRoute = useRecoilValue(currentPageRouteState);
  const toggleDrawer = useSetRecoilState(openMobileNavigationDrawerState);

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

  if (isMobile) {
    return (
      <Box mb={1}>
        <Divider
          sx={{
            width: "100%",
            bgcolor: "#E7E7E7",
          }}
        />
        <Box bgcolor="#fff" px={2} py={1}>
          <Button
            fullWidth
            variant="outlined"
            endIcon={<ArrowForwardIosIcon fontSize="small" />}
            onClick={() => toggleDrawer(true)}
            sx={{
              justifyContent: "space-between",
              height: 48,
              color: "#405DF9",
              borderRadius: "8px",
              borderColor: "#BDBDBD",
            }}
          >
            {currentRoute
              ? `${currentRoute.routeName}/${currentRoute.routeSubName}`
              : "最新動態"}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fff", mt: 1 }} px={{ xs: 4, lg: 6 }}>
      <Tabs value={value} onChange={handleChange}>
        {ROUTES.map((item, index) => {
          return <LinkTab key={index} label={item.title} href={item.path} />;
        })}
      </Tabs>
    </Box>
  );
}
