import { Box, Stack, styled, Button } from "@mui/material";
import React, { ReactNode } from "react";

interface ITabCard {
  tabs: any[];
  children: ReactNode;
  onChange?: (current: any) => void;
}

const ClickTabButton = styled(Button)(
  ({ isActive }: { isActive: boolean }) => ({
    minWidth: "168px",
    padding: "8px 16px",
    backgroundColor: isActive ? "#fff" : "#E0E0E0",
    color: isActive ? "#405DF9" : "#828282",
    fontSize: "16px",
    fontWeight: 400,
    borderRadius: "8px 8px 0 0",
  })
);

export default function TagCard({ tabs, onChange, children }: ITabCard) {
  const [tabIndex, setTabIndex] = React.useState(0);
  return (
    <Box>
      <Stack flexDirection="row" width="auto">
        {tabs.map((tab, index) => (
          <ClickTabButton
            key={tab}
            onClick={() => {
              onChange?.(index);
              setTabIndex(index);
            }}
            isActive={tabIndex === index}
          >
            {tab}
          </ClickTabButton>
        ))}
      </Stack>
      <Box px={3} pt={3} bgcolor="#fff" borderRadius="0 8px 8px 8px">
        {children}
      </Box>
    </Box>
  );
}
