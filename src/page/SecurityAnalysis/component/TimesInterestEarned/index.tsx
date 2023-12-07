import { Stack, Box } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Chart as ReactChart } from 'react-chartjs-2';
import { Chart } from 'chart.js';

import TagCard from '../../../../component/tabCard';
import { RATIO_DATASET, RATIO_GRAPH_CONFIG } from './GrapConfig';
import { PERIOD, PERIOD_YEAR } from 'types/common';

import { currentStock } from 'recoil/selector';
import { useRecoilValue } from 'recoil';

import PeriodController from 'component/PeriodController';
import { getDataLimit } from 'until';
import numeral from 'numeral';
import { fetchIncomeStatement } from 'api/financial';
import { IIncomeStatements } from 'types/financial';

const GRAPH_FIELDS = [
  {
    field: 'TIE',
    headerName: '利息保障倍數',
  },
];

export default function TimesInterestEarned() {
  const stock = useRecoilValue(currentStock);

  const chartRef = useRef<Chart>();

  const [tabIndex, setTabIndex] = useState(0);
  const [reportType, setReportType] = useState(PERIOD.QUARTER);
  const [period, setPeriod] = useState(3);
  const [data, setData] = useState<Array<IIncomeStatements>>([]);

  const updateGraph = (data: IIncomeStatements[]) => {
    if (chartRef.current) {
      const labels = data.map((item) => item.date);
      chartRef.current.data.labels = labels;

      GRAPH_FIELDS.forEach(async ({ field }, index) => {
        if (chartRef.current) {
          chartRef.current.data.datasets[index].data = data.map(
            (item) => item['incomeBeforeTax'] / (item['interestExpense'] || 0),
          );
        }
      });
      chartRef.current.update();
    }
  };

  const columnHeaders = useMemo(() => {
    const columns: any[] = [
      {
        field: 'title',
        headerName: reportType === PERIOD.QUARTER ? '年度/季度' : '年度',
        pinned: 'left',
      },
    ];
    data?.forEach((item) => {
      columns.push({
        field:
          reportType === PERIOD.QUARTER ? `${item.calendarYear}-${item.period}` : item.calendarYear,
      });
    });
    return columns;
  }, [data, reportType]);

  const tableRowData = useMemo(() => {
    const rowData: any[] = [];

    GRAPH_FIELDS.forEach(({ field, headerName }) => {
      const dataSources: { [key: string]: any } = {
        title: headerName,
      };

      data?.forEach((item) => {
        if (reportType === PERIOD.ANNUAL) {
          dataSources[item.calendarYear] = numeral(
            item['incomeBeforeTax'] / (item['interestExpense'] || 0),
          ).format('0,0.000');
        } else {
          dataSources[`${item.calendarYear}-${item.period}`] = numeral(
            item['incomeBeforeTax'] / (item['interestExpense'] || 0),
          ).format('0,0.000');
        }
      });
      rowData.push(dataSources);
    });
    return rowData;
  }, [data, reportType]);

  useEffect(() => {
    const limit = getDataLimit(reportType, period);
    fetchIncomeStatement(stock.Symbol, reportType, limit).then((rst) => {
      if (rst) {
        setData(rst || []);
        updateGraph(rst || []);
      }
    });
  }, [reportType, period]);

  return (
    <Stack rowGap={1}>
      <Box bgcolor="#fff" p={3} borderRadius="8px">
        <PeriodController onChangePeriod={setPeriod} onChangeReportType={setReportType} />
        <Box height={510}>
          <ReactChart
            type="line"
            data={RATIO_DATASET}
            options={RATIO_GRAPH_CONFIG as any}
            ref={chartRef}
          />
        </Box>
      </Box>

      <TagCard tabs={['詳細數據']}>
        <Box
          className="ag-theme-alpine"
          style={{
            paddingBottom: '24px',
          }}
        >
          <AgGridReact
            rowData={tableRowData}
            columnDefs={columnHeaders as any}
            defaultColDef={{
              resizable: false,
              initialWidth: 200,
              wrapHeaderText: true,
              autoHeaderHeight: true,
              // flex: 1,
            }}
            domLayout="autoHeight"
          />
        </Box>
      </TagCard>
    </Stack>
  );
}
