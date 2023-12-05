import {
  Box,
  Button,
  Divider,
  OutlinedInput,
  Stack,
  TextField,
  styled,
  useTheme,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import logoAssets from "../../assets/logo.svg";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TopStockBar from "../StockBar";
import NavTabs from "../Menu";
import SearchStockTextField from "component/SearchStockTextField";

const StyledLogo = styled(Link)(() => ({
  display: "inline-block",
  width: "160px",
  height: "42px",
  background: `url(${logoAssets}) no-repeat center`,
  backgroundSize: "cover",
}));

export default function AppHeader() {
  const theme = useTheme();
  return (
    <Box>
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          height: 96,
          px: 6,
          flexShrink: 0,
          bgcolor: "#fff",
          [theme.breakpoints.down("lg")]: {
            px: 4,
          },
        }}
      >
        <Stack flexDirection="row" alignItems="center" columnGap={3}>
          <StyledLogo to="/" />
          <SearchStockTextField />
        </Stack>
        <Stack flexDirection="row" alignItems="center" columnGap={2}>
          <Button sx={{ color: "#828282" }}>註冊</Button>
          <Divider
            sx={{
              width: "1px",
              height: "48px",
              bgcolor: "#F2F2F2",
            }}
          />
          <Button color="primary">登入</Button>
        </Stack>
      </Stack>
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        height="44px"
        py="10px"
        bgcolor="#fff"
        px={{
          xs: 4,
          lg: 6,
        }}
      >
        <TopStockBar />
        <Button
          variant="contained"
          sx={{
            background: "#405DF9",
            color: "#fff",
            borderRadius: "8px",
            ":hover": {
              background: "#405DF9",
            },
          }}
          startIcon={<AddIcon htmlColor="#fff" />}
        >
          追蹤
        </Button>
      </Stack>
      <NavTabs />
    </Box>
  );
}
