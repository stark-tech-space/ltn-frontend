import { IDateField } from "./common";

export enum VALUE_ASSESS_PAGE_ENUM {
  PAGE1 = "PAGE1",
  PAGE2 = "PAGE2",
  PAGE3 = "PAGE3",
  PAGE4 = "PAGE4",
  PAGE5 = "PAGE5",
  PAGE6 = "PAGE6",
  PAGE7 = "PAGE7",
}

export const VALUE_ASSESSMENT_CONVERTER: Record<
  VALUE_ASSESS_PAGE_ENUM,
  string
> = {
  [VALUE_ASSESS_PAGE_ENUM.PAGE1]: "本益比評價",
  [VALUE_ASSESS_PAGE_ENUM.PAGE2]: "本益比河流圖",
  [VALUE_ASSESS_PAGE_ENUM.PAGE3]: "股價淨值比評價",
  [VALUE_ASSESS_PAGE_ENUM.PAGE4]: "股價淨值比河流圖",
  [VALUE_ASSESS_PAGE_ENUM.PAGE5]: "現金股利殖利率",
  [VALUE_ASSESS_PAGE_ENUM.PAGE6]: "平均現金股息殖利率",
  [VALUE_ASSESS_PAGE_ENUM.PAGE7]: "平均現金股息河流圖",
};
