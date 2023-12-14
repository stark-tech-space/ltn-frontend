import { Stack, Typography, Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';
import AppHeader from '../Header';
import { Outlet } from 'react-router-dom';
import MobileDrawerNavigation from 'component/MobileNavigation';

export function PageLayout({
  tabs,
  children,
  sx = {},
}: {
  tabs?: any;
  sx?: SxProps;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        mx: {
          xs: 0,
          md: 3,
          lg: 6,
        },
        py: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default function Layout() {
  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        width="100vw"
        height="100vh"
        overflow="hidden auto"
        sx={{
          scrollBehavior: 'smooth',
        }}
      >
        <Stack minHeight="100vh">
          <AppHeader />
          <main style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
            <Outlet />
          </main>
          <footer
            style={{
              padding: '16px 0',
            }}
          >
            <Typography
              fontSize={{ xs: '12px', md: '14x', lg: '14px' }}
              sx={{
                color: '#333333',
                fontWeight: 400,
                lineHeight: '22px',
                fontFamily: 'PingFang SC',
                textAlign: 'center',
              }}
            >
              Copyright @ 2022-2023 Starktech. All Rights Reserved
            </Typography>
          </footer>
        </Stack>
      </Box>
      <MobileDrawerNavigation />
    </>
  );
}
