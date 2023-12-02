import { IDateField } from "./common";

export enum GROWTH_PAGE_ENUM {
  PAGE1 = "PAGE1",
  PAGE2 = "PAGE2",
  PAGE3 = "PAGE3",
  PAGE4 = "PAGE4",
  PAGE5 = "PAGE5",
  PAGE6 = "PAGE6",
}

export const GROWTH_PAGE_CONVERTER: Record<GROWTH_PAGE_ENUM, string> = {
  [GROWTH_PAGE_ENUM.PAGE1]: "月營收成長率",
  [GROWTH_PAGE_ENUM.PAGE2]: "營收成長率",
  [GROWTH_PAGE_ENUM.PAGE3]: "毛利成長率",
  [GROWTH_PAGE_ENUM.PAGE4]: "營業利益成長率",
  [GROWTH_PAGE_ENUM.PAGE5]: "稅後淨利成長率",
  [GROWTH_PAGE_ENUM.PAGE6]: "每股盈餘成長率",
};
