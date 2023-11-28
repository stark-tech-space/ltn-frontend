import { Box, Stack } from "@mui/material";
import { PageLayout } from "component/Layout";
import React from "react";

export default function Developing() {
  return (
    <PageLayout>
      <Stack
        alignItems="center"
        justifyContent="center"
        height="50vh"
        bgcolor="#fff"
        borderRadius="8px"
      >
        開發中...
      </Stack>
    </PageLayout>
  );
}
