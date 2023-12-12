import { Stack } from "@mui/material";
import { PageLayout } from "component/Layout";

export default function UnAvailable() {
  return (
    <PageLayout sx={{ mx: 0, py: 0 }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        height="50vh"
        bgcolor="#fff"
        borderRadius={{ xs: 0, md: "8px", lg: "8px" }}
      >
        該股不適用此指標
      </Stack>
    </PageLayout>
  );
}
