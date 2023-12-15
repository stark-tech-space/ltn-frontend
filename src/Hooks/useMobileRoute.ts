import { match } from "assert";
import React, { useCallback, useMemo } from "react";
import { useLocation, useMatches } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { currentPageRouteState } from "recoil/atom";
import { ROUTES } from "router";

export default function useMobileRoute() {
  const { pathname } = useLocation();
  const currentRoute = useRecoilValue(currentPageRouteState);

  //   console.log("currentRoute:", currentRoute);
  //   const route = useMemo(() => {
  //     if (currentRoute) {
  //         return null
  //       //   console.log("currentRoute:", currentRoute);
  //     }
  //     const fnd = ROUTES.find((item) => item.path === pathname);
  //     return fnd ? {
  //         path:fnd.path,
  //         subPath:Object.keys(fnd.children)[0],
  //     }
  //   }, [pathname, currentRoute]);

  return currentRoute;
}
