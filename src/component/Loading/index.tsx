import React from "react";
import { Box, Fade, CircularProgress } from "@mui/material";
export default function CircularLoading({ open }: { open: boolean }) {
  if (!open) {
    return null;
  }
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="rgba(0,0,0,0.01)"
      zIndex={100}
    >
      <Fade in>
        <CircularProgress />
      </Fade>
    </Box>
  );
}
