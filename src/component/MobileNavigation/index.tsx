import * as React from "react";
import {
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  Drawer,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { ROUTES } from "router";
import SearchStockTextField from "component/SearchStockTextField";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  currentPageRouteState,
  openMobileNavigationDrawerState,
} from "recoil/atom";

export default function MobileDrawerNavigation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { pathname } = useLocation();
  const [open, setOpen] = useRecoilState(openMobileNavigationDrawerState);
  const [currentPageRoute, setPageRoute] = useRecoilState(
    currentPageRouteState
  );

  const na = useNavigate();
  const [selectedPath, setSelectedPath] = React.useState(pathname || "/");

  const selectedRoute = React.useMemo(
    () => ROUTES.find((item) => item.path === selectedPath),
    [selectedPath]
  );

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(open);
    };

  const handleClickParentRoute = (route: any) => {
    if (!route.children) {
      // debugger;
      na(route.path);
      setSelectedPath(route.path);
      setOpen(false);
    } else {
      setSelectedPath(route.path);
    }
    setPageRoute(null);
  };

  const handleClickChildRoute = (subPath: string, routeSubName: string) => {
    if (selectedRoute) {
      setPageRoute({
        path: selectedRoute.path,
        routeName: selectedRoute.title,
        routeSubName,
        subPath,
      });
      na(selectedRoute.path);
      setOpen(false);
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <Stack
        width="100vw"
        height="100vh"
        bgcolor="#F3F3F3"
        role="presentation"
        overflow="hidden"
      >
        <Stack
          direction="row"
          alignItems="center"
          px={2}
          columnGap={1}
          flexShrink={0}
          bgcolor="#fff"
          pt={2}
          pb={3}
        >
          <IconButton sx={{ pl: 0 }} onClick={toggleDrawer(false)}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <SearchStockTextField />
        </Stack>
        <Stack
          flex={1}
          direction="row"
          alignItems="stretch"
          height="calc(100vh - 80px)"
        >
          <Box
            flexShrink={0}
            width={110}
            bgcolor="#F3F3F3"
            sx={{
              "&>button": {
                px: 2,
                py: "12px",
              },
              overflow: "hidden auto",
              scrollBehavior: "smooth",
            }}
          >
            {ROUTES.map((route) => (
              <Button
                key={route.path}
                fullWidth
                onClick={() => handleClickParentRoute(route)}
                sx={{
                  color: selectedPath === route.path ? "#405DF9" : "#000000E5",
                  bgcolor: selectedPath === route.path ? "#fff" : "#F3F3F3",
                }}
              >
                {route.title}
              </Button>
            ))}
          </Box>
          <Box
            flex={1}
            bgcolor="#fff"
            sx={{
              "&>button": {
                justifyContent: "flex-start",
                pl: 3,
                py: "12px",
              },
              overflow: "hidden auto",
              scrollBehavior: "smooth",
            }}
          >
            {Object.entries(
              (selectedRoute?.children as { [page: string]: string }) || []
            ).map(([key, value]) => {
              return (
                <React.Fragment key={key}>
                  <Button
                    fullWidth
                    sx={{
                      color:
                        currentPageRoute?.subPath === key
                          ? "#405DF9"
                          : "#000000E5",
                    }}
                    onClick={() => {
                      handleClickChildRoute(key, value);
                    }}
                  >
                    {value}
                  </Button>
                  <Divider />
                </React.Fragment>
              );
            })}
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
}
