import React, { ReactNode } from "react";
import { Box, Stack, styled, Button, Theme, useTheme } from "@mui/material";

interface ITabCard {
  tabs: any[];
  disabled?: boolean;
  children: ReactNode;
  visible?: boolean;
  onChange?: (current: any) => void;
}

const ClickTabButton = styled(Button)(
  ({ isActive, theme }: { isActive: boolean; theme: Theme }) => ({
    minWidth: "168px",
    padding: "8px 16px",
    backgroundColor: isActive ? "#fff !important" : "#E0E0E0 !important",
    color: isActive ? "#405DF9" : "#828282",
    fontSize: "16px",
    fontWeight: 400,
    borderRadius: "8px 8px 0 0",
    [theme.breakpoints.down("md")]: {
      borderRadius: "4px 4px 0 0",
    },
  })
);

export default function TagCard({
  tabs,
  onChange,
  disabled,
  children,
  visible = true,
}: ITabCard) {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTabIndex = (index: number) => {
    onChange?.(index);
    setTabIndex(index);
  };

  return (
    <Box>
      <Stack
        flexDirection="row"
        width="auto"
        display={visible ? "flex" : "none"}
      >
        {tabs.map((tab, index) => (
          <ClickTabButton
            key={tab}
            theme={theme}
            disabled={disabled}
            onClick={() => handleChangeTabIndex(index)}
            isActive={disabled ? false : tabIndex === index}
          >
            {tab}
          </ClickTabButton>
        ))}
      </Stack>
      <Box
        px={{ xs: 2, lg: 3 }}
        pt={{ xs: 2, lg: 3 }}
        bgcolor="#fff"
        borderRadius={{
          xs: "0",
          md: "0 8px 8px 8px",
          lg: "0 8px 8px 8px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
