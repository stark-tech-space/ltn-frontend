import { selector } from "recoil";
import { stockKeyState } from "./atom";

export const currentStock = selector({
  key: "current-stock-state",
  get: ({ get }) => {
    const stockValue = get(stockKeyState);
    return {
      Symbol: `${stockValue.No}.TW`,
      Name: stockValue.Name,
      No: stockValue.No,
    };
  },
});
