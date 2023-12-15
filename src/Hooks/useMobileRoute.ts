import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { currentPageRouteState } from "recoil/atom";
import { ROUTES } from "router";

export default function useMobileRoute() {
  const { pathname } = useLocation();
  const currentRoute = useRecoilValue(currentPageRouteState);

  return useMemo(() => {
    if (currentRoute) {
      return currentRoute;
    }
    const fnd = ROUTES.find((item) => item.path === pathname);
    const [subPath, routeSubName] = fnd?.children
      ? Object.entries(fnd?.children ?? {})[0]
      : [];
    return fnd
      ? {
          path: fnd.path,
          subPath,
          routeName: fnd.title,
          routeSubName,
        }
      : null;
  }, [pathname, currentRoute]);
}
