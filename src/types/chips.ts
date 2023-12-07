import { IDateField } from "./common";

export enum CHIPS_PAGE_ENUM {
  PAGE1 = "PAGE1",
  PAGE2 = "PAGE2",
  PAGE3 = "PAGE3",
}

export const CHIPS_PAGE_CONVERTER: Record<CHIPS_PAGE_ENUM, string> = {
  [CHIPS_PAGE_ENUM.PAGE1]: "三大買賣超",
  [CHIPS_PAGE_ENUM.PAGE2]: "外資及陸資買賣超",
  [CHIPS_PAGE_ENUM.PAGE3]: "分點籌碼動向",
};
