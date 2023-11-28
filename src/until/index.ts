import BigNumber from "bignumber.js";

export const sleep = (time = 120) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const _debounce = (fn: () => void, timeout = 300) => {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    }, timeout);
  };
};

export const sortByArray = (arr: any[], key: string) => {
  return arr.sort((a, b) => {
    return a[key] - b[key];
  });
};

export const addPlaceHolder = (value: any, symbol: string = "") => {
  if (value === null || value === undefined) {
    return "--";
  }
  return `${value} ${symbol}`;
};

export const formNumberToUnit = (
  number?: number,
  unit: string = "K",
  pow = 3
) => {
  if (!number) {
    return 0;
  }
  const formattedResult = new BigNumber(number)
    .dividedBy(new BigNumber(10).pow(pow))
    .toFixed(3);
  return `${formattedResult}${unit}`;
};

export const toFixed = (n: number, d: number = 2) => {
  return n ? n.toFixed(d) : "-";
};
