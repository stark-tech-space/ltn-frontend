import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";

const changeINfo = [
  { label: "單月營收年增率", value: 1 },
  { label: "單月每股營收年增率", value: 2 },
  { label: "單月營收月增率", value: 3 },
];

export default function RevenueTypedController({
  onChangeType,
}: {
  onChangeType?: (title: string, value: number) => void;
}) {
  const [period, setPeriod] = useState(1);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mb: 3,
        "&>button": {
          mx: 1,
          bgcolor: "transparent",
          border: 0,
          cursor: "pointer",
        },
      }}
    >
      <Box>
        {changeINfo.map((item) => (
          <Button
            key={item.value}
            sx={{
              color: item.value === period ? "#405DF9" : "#333",
            }}
            onClick={() => {
              setPeriod(item.value);
              onChangeType?.(item.label, item.value);
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Stack>
  );
}
