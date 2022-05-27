export type ChartTypeGraphData = Record<'name', string> & Record<string, number>;

export type ChartTypePortionData = Record<'name', string> & Record<'value', number>;

export type QueryChartData =
  | {
      type: 'bar' | 'area' | 'line';
      data: ChartTypeGraphData[];
    }
  | {
      type: 'pie';
      data: ChartTypePortionData[];
    };

export type QueryConfig = {
  mode: 'light' | 'dark';
  width: number;
  height: number;
};

export type QueryData = {
  config: QueryConfig;
  chart: QueryChartData;
};