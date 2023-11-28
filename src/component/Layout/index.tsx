import { Button, Stack, Typography, Box, SxProps } from "@mui/material";
import React, { useState, ReactNode } from "react";
import AppHeader from "../Header";
import { Outlet } from "react-router-dom";

export function PageLayout({
  tabs,
  children,
  sx = {},
}: {
  tabs?: any;
  sx?: SxProps;
  children: ReactNode;
}) {
  return <Box sx={{ mx: 6, py: 1, ...sx }}>{children}</Box>;
}

export default function Layout() {
  return (
    <Stack minHeight="100vh">
      <AppHeader />
      <main style={{ flex: 1, width: "100%", boxSizing: "border-box" }}>
        <Outlet />
      </main>
      <footer
        style={{
          padding: "16px 0",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: "#333333",
            fontWeight: 400,
            lineHeight: "22px",
            fontFamily: "PingFang SC",
            textAlign: "center",
          }}
        >
          Copyright @ 2022-2023 Starktech. All Rights Reserved
        </Typography>
      </footer>
    </Stack>
  );
}
