import BigNumber from "bignumber.js";
import moment from "moment";
import { IFinMindDataItem, PERIOD } from "types/common";

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

export const createYears = () => {
  const now = new Date();
  const year = now.getFullYear();
  const years = [];
  for (let i = 0; i < 10; i++) {
    years.push(year - i);
  }
  return years;
};

export const getDataLimit = (period: PERIOD, year: number) => {
  if (period === PERIOD.QUARTER) {
    return year * 4;
  }
  return year;
};

export const getBeforeYears = (years: number) => {
  return moment().subtract(years, "years").startOf("year").format("YYYY-MM-DD");
};

export const findMindDataToFmpData = (data: IFinMindDataItem) => {
  return {
    date: data.date,
    calendarYear: moment(data.date).format("YYYY"),
    [data.type]: data.value,
    period: moment(data.date).format("MM"),
  };
};
