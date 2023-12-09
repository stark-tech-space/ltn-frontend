export interface IDividendPerShareHistorical {
  adjDividend: number;
  date: string;
  declarationDate: string;
  dividend: number | null;
  label: string;
  paymentDate: string;
  recordDate: string;
}
