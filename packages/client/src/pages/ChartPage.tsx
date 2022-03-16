import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from 'recharts';

function formatError(error: any, fallback?: string): string {
  if (typeof error === 'object' && 'message' in error) return error.message.toString();
  if (typeof error === 'string') return error;
  return fallback || 'An unkown error occurred';
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }

  return color;
}

function getRandomDarkColor() {
  const letters = '012';
  const start1 = letters[Math.floor(Math.random() * letters.length)];
  const start2 = letters[Math.floor(Math.random() * letters.length)];
  const color = getRandomColor();

  return `#${start1}${start2}${color.slice(3)}`;
}

function getRandomLightColor() {
  const letters = 'DEF';
  const start1 = letters[Math.floor(Math.random() * letters.length)];
  const start2 = letters[Math.floor(Math.random() * letters.length)];
  const color = getRandomColor();

  return `#${start1}${start2}${color.slice(3)}`;
}

function getDarkBgColor() {
  return '#141414';
}

function getLightBgColor() {
  return '#dedede';
}


type ChartProps = {
  keys: string[];
  colorKepMap: Record<string, string>;
  background: string,
  width: number;
  height: number;
  gap: number;
};

const QueryBarChart = ({ keys, colorKepMap, background, width, height, gap }: ChartProps) => {
};

type ChartTypeGraphData = Record<'name', string> & Record<string, number>;
type ChartTypePortionData = Record<'name', string> & Record<'value', number>;

type QueryChartGraphData = {
  type: 'bar' | 'area' | 'line';
  data: ChartTypeGraphData[];
};

type QueryChartPortionData = {
  type: 'pie';
  data: ChartTypePortionData[];
};

type QueryChartData = QueryChartGraphData | QueryChartPortionData;

type QueryConfig = {
  mode: 'light' | 'dark';
  width: number;
  height: number;
};

type QueryData = {
  config: QueryConfig;
  chart: QueryChartData;
};

const Chart = ({ config, chart }: QueryData) => {
  const { mode, width, height } = config;
  const { type, data } = chart;

  if (!data.length) {
    throw new Error('data is empty');
  }

  const keys = [...Object.keys(data[0])].filter(k => k !== 'name');
  const colorKepMap: Record<string, string> = {};

  for (const key of keys) {
    const color = mode === 'light' ? getRandomDarkColor() : getRandomLightColor();
    colorKepMap[key] = color;
  }

  const background = mode === 'light' ? getLightBgColor() : getDarkBgColor();
  const gap = 40;

  return (
    <div style={{ margin: gap, background, width, height }}>
      {type === 'bar' && (
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
            <Bar key={key} dataKey={key} fill={colorKepMap[key]} />
          ))}
        </BarChart>
      )}
      {type === 'area' && (
        <AreaChart
          width={width}
          height={height}
          margin={{ top: gap, right: gap, bottom: gap, left: gap }}
          data={data}
        >
          <defs>
            {keys.map((key) => (
              <linearGradient
                key={`${key}.gradient`}
                id={`color_${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={colorKepMap[key]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colorKepMap[key]} stopOpacity={0} />
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
              stroke={colorKepMap[key]}
              fillOpacity={1}
              fill={`url(#color_${key})`}
            />
          ))}
        </AreaChart>
      )}
      {type === 'line' && (
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
            <Line key={key} dataKey={key} fill={colorKepMap[key]} />
          ))}
        </LineChart>
      )}
    </div>
  );
};

const ChartPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [error, setError] = useState<null | string>(null);
  const [queryData, setQueryData] = useState<null | QueryData>(null);

  useEffect(() => {
    try {
      const decoded = atob(query);
      const parsed = JSON.parse(decoded) as QueryData;
      setQueryData(parsed);
    } catch (e) {
      setError(formatError(e));
    }
  }, [query]);

  if (error) {
    return (
      <div className="page page--chart">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page page--chart">
      {queryData && <Chart {...queryData} />}
    </div>
  );
};

export default ChartPage;
