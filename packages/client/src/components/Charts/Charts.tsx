import * as React from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from 'recharts';
import {
  getRandomDarkColor,
  getRandomLightColor,
  getLightBgColor,
  getDarkBgColor,
} from '../../utils/colorUtils';
import {
  ChartTypeGraphData,
  ChartTypePortionData,
  QueryData,
} from '../../types/baseTypes'

function isPortionDataList(data: ChartTypeGraphData[] | ChartTypePortionData[]): boolean {
  for (let i = 0; i < data.length; i += 1) {
    const d = data[i];
    const keys = Object.keys(d);

    if (keys.length !== 2 || typeof d.name !== 'string' || typeof d.value !== 'number') {
      return false;
    }
  }
  return true;
}

type QueryChartProps = {
  data: ChartTypeGraphData[] | ChartTypePortionData[];
  keys: string[];
  colorToKeyMap: Record<string, string>;
  width: number;
  height: number;
  gap: number;
};

const QueryBarChart = ({ data, keys, colorToKeyMap, width, height, gap }: QueryChartProps) => {
  return (
    <BarChart
      width={width}
      height={height}
      margin={{ top: gap, right: gap, bottom: gap, left: gap }}
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Legend />
      {keys.map((key) => (
        <Bar key={key} dataKey={key} fill={colorToKeyMap[key]} isAnimationActive={false} />
      ))}
    </BarChart>
  );
};

const QueryAreaChart = ({ data, keys, colorToKeyMap, width, height, gap }: QueryChartProps) => {
  return (
    <AreaChart
      width={width}
      height={height}
      margin={{ top: gap, right: gap, bottom: gap, left: gap }}
      data={data}
    >
      <defs>
        {keys.map((key) => (
          <linearGradient key={`${key}.gradient`} id={`color_${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colorToKeyMap[key]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={colorToKeyMap[key]} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Legend />
      {keys.map((key) => (
        <Area
          key={key}
          type="monotone"
          dataKey={key}
          stroke={colorToKeyMap[key]}
          fillOpacity={1}
          fill={`url(#color_${key})`}
          isAnimationActive={false}
        />
      ))}
    </AreaChart>
  );
};

const QueryLineChart = ({ data, keys, colorToKeyMap, width, height, gap }: QueryChartProps) => {
  return (
    <LineChart
      width={width}
      height={height}
      margin={{ top: gap, right: gap, bottom: gap, left: gap }}
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Legend />
      {keys.map((key) => (
        <Line key={key} dataKey={key} fill={colorToKeyMap[key]} isAnimationActive={false} />
      ))}
    </LineChart>
  );
};

const QueryPieChart = ({ data, colorToKeyMap, width, height, gap }: QueryChartProps) => {
  return (
    <PieChart
      width={width}
      height={height}
      margin={{ top: gap, right: gap, bottom: gap, left: gap }}
    >
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={(width - gap) / 3}
        fill="black"
        isAnimationActive={false}
      >
        {data.map((d) => (
          <Cell key={d.name} fill={colorToKeyMap[d.name]} />
        ))}
      </Pie>
      <Legend />
    </PieChart>
  );
};

export const QueryChart = ({ config, chart }: QueryData) => {
  const { mode, width, height } = config;
  const { type, data } = chart;

  if (!data || !data.length) {
    throw new Error('Data cannot be empty!');
  }

  const keys = isPortionDataList(data)
    ? data.map((d) => d.name)
    : [...Object.keys(data[0])].filter((k) => k !== 'name');

  const colorToKeyMap: Record<string, string> = {};

  for (const key of keys) {
    const color = mode === 'light' ? getRandomDarkColor() : getRandomLightColor();
    colorToKeyMap[key] = color;
  }

  const background = mode === 'light' ? getLightBgColor() : getDarkBgColor();
  const gap = 40;

  const props: QueryChartProps = {
    data,
    keys,
    colorToKeyMap,
    width,
    height,
    gap,
  };

  return (
    <div id="chart" style={{ margin: gap, background, width, height }}>
      {type === 'bar' && <QueryBarChart {...props} />}
      {type === 'area' && <QueryAreaChart {...props} />}
      {type === 'line' && <QueryLineChart {...props} />}
      {type === 'pie' && <QueryPieChart {...props} />}
    </div>
  );
};
