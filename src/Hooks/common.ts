import { useEffect } from "react";
import { debounce } from "@mui/material";

export const useWindowResize = (node: HTMLDivElement, chart: any) => {
  const handleResize = debounce(() => {
    if (node && chart) {
      chart?.resize(node.clientWidth, node.clientHeight);
      console.log("resize", node.clientWidth, node.clientHeight);
    } else {
      console.log("resize", 0, 0);
    }
  }, 60);

  useEffect(() => {
    setTimeout(() => {
      window.addEventListener("resize", handleResize, false);
      return () => {
        window.removeEventListener("resize", handleResize, false);
      };
    }, 2000);
  }, [chart, node, handleResize]);
};
