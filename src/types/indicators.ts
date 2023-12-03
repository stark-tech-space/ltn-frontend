import { IDateField } from "./common";

export enum INDICATORS_PAGE_ENUM {
  PAGE1 = "PAGE1",
  PAGE2 = "PAGE2",
  PAGE3 = "PAGE3",
  PAGE4 = "PAGE4",
  PAGE5 = "PAGE5",
  PAGE6 = "PAGE6",
  PAGE7 = "PAGE7",
  PAGE8 = "PAGE8",
  PAGE9 = "PAGE9",
  PAGE10 = "PAGE10",
}

export const INDICATORS_CONVERTER: Record<INDICATORS_PAGE_ENUM, string> = {
  [INDICATORS_PAGE_ENUM.PAGE1]: "長短期月營收年增率",
  [INDICATORS_PAGE_ENUM.PAGE2]: "長短期月營收平均值",
  [INDICATORS_PAGE_ENUM.PAGE3]: "自由現金流報酬率",
  [INDICATORS_PAGE_ENUM.PAGE4]: "Piotroski F 分數",
  [INDICATORS_PAGE_ENUM.PAGE5]: "長短期金融借款",
  [INDICATORS_PAGE_ENUM.PAGE6]: "現金週轉循環",
  [INDICATORS_PAGE_ENUM.PAGE7]: "彼得林區評價",
  [INDICATORS_PAGE_ENUM.PAGE8]: "股利折現評價",
  [INDICATORS_PAGE_ENUM.PAGE9]: "現金流折現評價",
  [INDICATORS_PAGE_ENUM.PAGE10]: "大股東持股比率",
};
