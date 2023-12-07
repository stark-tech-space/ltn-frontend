// 计算sma的月价格

import moment from "moment";
import { IIndicatorItem } from "types/common";
import { sortCallback } from "until";

export const getSmaByMonth = (data: IIndicatorItem[]) => {
  const sortedData = data.sort(sortCallback).map((item) => {
    return {
      ...item,
      year: moment(item.date).format("YYYY"),
      month: moment(item.date).format("MM"),
    };
  });

  let keyId = sortedData[0].year;
  const groupByYears: { [year: string]: { month: string; sma: number }[] } = {
    [keyId]: [],
  };

  sortedData.forEach((item, index) => {
    if (item.year !== keyId) {
      keyId = item.year;
    }
    if (groupByYears[keyId]) {
      groupByYears[keyId].push({
        month: item.month,
        sma: item.sma,
      });
    } else {
      groupByYears[keyId] = [{ month: item.month, sma: item.sma }];
    }
  });

  const groupByMonths: any = {};

  for (let key in groupByYears) {
    const yearData = groupByYears[key].slice();
    let monthId = yearData[0].month;
    const groupMonths: { [month: string]: number[] } = {};

    yearData.forEach((item) => {
      if (item.month !== monthId) {
        monthId = item.month;
      }
      if (groupMonths[monthId]) {
        groupMonths[monthId].push(item.sma);
      } else {
        groupMonths[monthId] = [item.sma];
      }
    });
    groupByMonths[key] = groupMonths;
  }

  const list: any[] = [];
  Object.entries(groupByMonths).forEach(([year, monthData]) => {
    Object.entries(monthData as { [key: string]: number[] }).forEach(
      ([month, sma]) => {
        list.push({
          date: `${year}-${month}-01`,
          sma: +(
            sma.reduce((a: number, b: number) => a + b, 0) / sma.length
          ).toFixed(2),
        });
      }
    );
  });

  return list.sort(sortCallback);
};
