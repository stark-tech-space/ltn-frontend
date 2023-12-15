export enum COLOR_TYPE {
  UP = "UP",
  DOWN = "DOWN",
}

export const UP_COLOR_BG = "#FEF3F2";
export const DOWN_COLOR_BG = "#ECFDF3";
export const UP_COLOR_TEXT = "#D92D20";
export const DOWN_COLOR_TEXT = "#27AE60";

export const COLOR_BG_CONVERTER: Record<COLOR_TYPE, string> = {
  [COLOR_TYPE.UP]: UP_COLOR_BG,
  [COLOR_TYPE.DOWN]: DOWN_COLOR_BG,
};

export const COLOR_TEXT_CONVERTER: Record<COLOR_TYPE, string> = {
  [COLOR_TYPE.UP]: UP_COLOR_TEXT,
  [COLOR_TYPE.DOWN]: DOWN_COLOR_TEXT,
};
