import { Stack } from "@mui/material";
import { PageLayout } from "component/Layout";
import React from "react";

export default function Developing() {
  return (
    <PageLayout sx={{ mx: 0, py: 0 }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        height="50vh"
        bgcolor="#fff"
        borderRadius={{ xs: 0, md: "8px", lg: "8px" }}
      >
        開發中...
      </Stack>
    </PageLayout>
  );
}
