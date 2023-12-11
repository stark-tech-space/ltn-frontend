import * as React from "react";

import {
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  styled,
  // SwipeableDrawer,
  Button,
  Divider,
  Box,
  Drawer,
} from "@mui/material";
import SegmentIcon from "@mui/icons-material/Segment";
import { Link } from "react-router-dom";
import logoAssets from "../../assets/logo.svg";
import SearchStockTextField from "component/SearchStockTextField";

const StyledLogo = styled(Link)(() => ({
  display: "inline-block",
  width: "148px",
  height: "36px",
  marginBottom: "8px",
  background: `url(${logoAssets}) no-repeat center`,
  backgroundSize: "contain",
}));

export default function MenuDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  if (!isMobile) {
    return null;
  }

  return (
    <React.Fragment>
      <IconButton onClick={toggleDrawer(true)} sx={{ pr: 0 }}>
        <SegmentIcon htmlColor="#000000E5" fontSize="large" />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        // onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
      >
        <Stack
          width={{ xs: "70vw", md: "70vw" }}
          role="presentation"
          py={2}
          pl={0}
          boxSizing="border-box"
        >
          <StyledLogo to="/" />
          <Stack
            alignItems="center"
            columnGap={2}
            pl={2}
            my={1}
            sx={{
              "&>button": {
                width: "100%",
                height: 56,
                p: 0,
                justifyContent: "flex-start",
              },
            }}
          >
            <Box width="100%" pr={2} boxSizing="border-box">
              <SearchStockTextField />
            </Box>
            <Button sx={{ color: "#828282" }}>註冊</Button>
            <Divider
              sx={{
                width: "100%",
                bgcolor: "#E7E7E7",
              }}
            />
            <Button color="primary">登入</Button>
            <Divider
              sx={{
                width: "100%",
                bgcolor: "#E7E7E7",
              }}
            />
          </Stack>
        </Stack>
      </Drawer>
    </React.Fragment>
  );
}
