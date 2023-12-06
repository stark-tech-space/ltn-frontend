import { DefaultValue, atom } from "recoil";

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: any) => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

export const stockKeyState = atom({
  key: "stock-key-state",
  default: { No: "2330", Name: "台積電", ChName: "", EnName: "" },
  effects_UNSTABLE: [localStorageEffect("ltn-stock-key")],
});

export const stockPerQuarterCountState = atom({
  key: "stock-key-count",
  default: [] as { date: string; StockCount: number; EPS: number }[],
});
