import BigNumber from "bignumber.js";
import moment from "moment";
import { IFinMindDataItem, ILTNDataItem, PERIOD } from "types/common";

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

export const getDataLimit = (period: PERIOD, year: number, adder?: number) => {
  if (period === PERIOD.QUARTER) {
    return year * 4 + (adder || 0);
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

export const ltnApiDataToFmpData = (data: ILTNDataItem) => {
  const date = moment(data.date, "YYYY年M月D日");
  return {
    code: data.code,
    date: date.format("YYYY-MM-DD"),
    calendarYear: date.year(),
    period: date.month() + 1,
    quarter: date.quarter(),
    name: data.name,
    value: parseFloat(data.value.replace(/,/g, "")),
  };
};

export const genFullDateObject = (time: string) => {
  const m = moment(time);
  return {
    date: m.format("YYYY-MM-DD"),
    calendarYear: m.format("YYYY"),
    month: m.format("MM"),
    quarter: m.quarter(),
    period: m.format("YYYY-[Q]Q"),
  };
};

export const sortCallback = (t1: { date: string }, t2: { date: string }) => {
  return moment(t1.date).unix() - moment(t2.date).unix();
};

// 2023年7月1日、2023年7月1日至9月30日
export const caseDateToYYYYMMDD = (dateString: string) => {
  if (/\d{4}年度/g.test(dateString)) {
    const yearMoment = moment(dateString.slice(0, 4), "YYYY");
    return {
      start: yearMoment.startOf("year").format("YYYY-MM-DD"),
      end: yearMoment.endOf("year").format("YYYY-MM-DD"),
      isSingleQuarter: false,
    };
  }
  if (/\d{4}年第\d季/g.test(dateString)) {
    const quarterMoment = moment(dateString, "YYYY年第Q季");
    return {
      start: quarterMoment.startOf("quarter").format("YYYY-MM-DD"),
      end: quarterMoment.endOf("quarter").format("YYYY-MM-DD"),
      isSingleQuarter: true,
    };
  }
  const [start, end] = dateString.split("至");
  const startMoment = moment(start.replaceAll(/年|月|日/g, "-"), "YYYY-M-D");
  let endMoment = null;
  if (end) {
    const endString = end.replaceAll(/年|月|日/g, "-");
    endMoment = moment(
      `${endString.length > 6 ? "" : startMoment.format("YYYY-")}${endString}`,
      "YYYY-M-D"
    );
  }
  let isSingleQuarter = endMoment
    ? Math.abs(startMoment.diff(endMoment, "day")) < 94
    : true;

  return {
    start: startMoment.format("YYYY-MM-DD"),
    end: endMoment?.format("YYYY-MM-DD") || null,
    isSingleQuarter,
  };
};
export const quarterToMonth = (quarter: string) => {
  if (quarter === "Q1") {
    return `01`;
  }
  if (quarter === "Q2") {
    return `04`;
  }
  if (quarter === "Q3") {
    return `07`;
  }
  if (quarter === "Q4") {
    return `10`;
  }
};
