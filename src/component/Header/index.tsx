import { Box, Button, Divider, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import logoAssets from "../../assets/logo.svg";
import AddIcon from "@mui/icons-material/Add";
import TopStockBar from "../StockBar";
import NavTabs from "../Menu";
import SearchStockTextField from "component/SearchStockTextField";
import MenuDrawer from "component/MenuDrawer/";

const StyledLogo = styled(Link)(() => ({
  display: "inline-block",
  width: "160px",
  height: "42px",
  background: `url(${logoAssets}) no-repeat center`,
  backgroundSize: "cover",
}));

export default function AppHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          bgcolor: "#fff",
          [theme.breakpoints.up("md")]: {
            py: 3,
            px: 4,
          },
          [theme.breakpoints.down("md")]: {
            p: 2,
            height: "auto",
          },
        }}
      >
        <Stack
          flex={1}
          flexDirection="row"
          alignItems="center"
          columnGap={{
            xs: 0,
            md: 2,
            lg: 4,
          }}
        >
          <StyledLogo to="/" sx={{ display: isMobile ? "none" : "inline-block" }} />
          <SearchStockTextField />
        </Stack>
        <MenuDrawer />
        {/* <Stack
          flexDirection="row"
          alignItems="center"
          columnGap={2}
          sx={{ display: isMobile ? "none" : "inline-flex" }}
        >
          <Button sx={{ color: "#828282" }}>註冊</Button>
          <Divider
            sx={{
              width: "1px",
              height: "48px",
              bgcolor: "#F2F2F2",
            }}
          />
          <Button color="primary">登入</Button>
        </Stack> */}
      </Stack>
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        height="44px"
        bgcolor="#fff"
        sx={{
          [theme.breakpoints.up("md")]: {
            px: 4,
            pb: "12px",
          },
          [theme.breakpoints.down("md")]: {
            px: 2,
            pb: 1,
            height: "auto",
          },
        }}
      >
        <TopStockBar />
        {/* <Button
          variant="contained"
          sx={{
            background: "#405DF9",
            color: "#fff",
            borderRadius: "8px",
            [theme.breakpoints.down("md")]: {
              // display: "none",
              position: "fixed",
              right: "16px",
              bottom: "30px",
              zIndex: 100,
              boxShadow: "rgba(0, 0, 0, 0.35) 0 5px 15px",
            },
            ":hover": {
              background: "#405DF9",
            },
          }}
          startIcon={<AddIcon htmlColor="#fff" />}
        >
          追蹤
        </Button> */}
      </Stack>
      <NavTabs />
    </Box>
  );
}
