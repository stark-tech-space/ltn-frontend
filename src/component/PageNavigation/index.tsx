import { FC, useEffect, useState } from "react";
import {
  Stack,
  styled,
  Link,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSetRecoilState } from "recoil";
import { currentPageRouteState } from "recoil/atom";
import { useLocation } from "react-router-dom";
import { ROUTES } from "router";
import useMobileRoute from "Hooks/useMobileRoute";

interface PageMenuProps<T> {
  menuConverter: Record<string, string>;
  defaultActiveTab: T;
  onChange: (value: T) => void;
}

const LinkTab = styled(Link)(({ isActive }: { isActive: boolean }) => ({
  padding: "12px 24px",
  fontWeight: 400,
  fontSize: "16px",
  borderRight: "1px solid #F2F2F2",
  color: isActive ? "#405DF9" : "#828282",
  textDecoration: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
}));

const PageNavigation: FC<PageMenuProps<string>> = ({
  menuConverter,
  defaultActiveTab,
  onChange,
  ...props
}) => {
  const theme = useTheme();
  const { pathname } = useLocation();

  const currentPageRoute = useMobileRoute();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTab, setActiveTab] = useState<string>(
    currentPageRoute?.subPath || defaultActiveTab
  );
  const setCurrentPageRoute = useSetRecoilState(currentPageRouteState);

  useEffect(() => {
    setActiveTab(currentPageRoute?.subPath || defaultActiveTab);
  }, [currentPageRoute, defaultActiveTab]);

  const handleClickTab = (key: string, value: string) => {
    setActiveTab(key);
    onChange(key);

    setCurrentPageRoute({
      path: pathname,
      subPath: key,
      routeName: ROUTES.find((route) => route.path === pathname)?.title || "",
      routeSubName: menuConverter[key],
    });
  };

  if (isMobile) {
    return null;
  }

  return (
    <Box
      bgcolor="#fff"
      px="48px"
      mb={1}
      sx={{
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "-ms-autohiding-scrollbar",
        scrollbarWidth: "2px",
        scrollbarGutter: "stable",
        overflow: "auto hidden",
      }}
    >
      <Stack
        minWidth="100%"
        flexDirection="row"
        alignItems="center"
        flexWrap="nowrap"
        sx={{
          ".MuiTypography-button:last-child": {
            borderRight: "none",
            pl: 2,
          },
          ".MuiTypography-button:first-child": {
            pl: 2,
          },
        }}
      >
        {Object.entries(menuConverter).map(([key, value]) => (
          <LinkTab
            key={key}
            variant="button"
            isActive={key === activeTab}
            onClick={() => handleClickTab(key, value)}
          >
            {value}
          </LinkTab>
        ))}
      </Stack>
    </Box>
  );
};

export default PageNavigation;
