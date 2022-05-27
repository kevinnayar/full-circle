import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  QueryConfig,
  QueryChartData,
  ChartTypeGraphData,
  ChartTypePortionData,
  QueryData,
} from '../types/baseTypes';
import { SubmitButton, LinkButton } from '../components/Buttons/Buttons';
import { InputNumber } from '../components/Inputs/Inputs';

async function imageDownloader(url: string) {
  if (!window || !document) {
    throw new Error('Access to document is required for download');
  }

  const file = await fetch(url);
  const buffer = await file.arrayBuffer();
  const downloadUrl = window.URL.createObjectURL(new Blob([buffer]));

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', 'image.png');

  document.body.appendChild(link);
  link.click();
}

const HomePage = () => {
  const [urls, setUrls] = useState<{ client: string, server: string }>({
    client: '',
    server: '',
  });

  const [queryConfig, setQueryConfig] = useState<QueryConfig>({
    mode: 'light',
    width: 500,
    height: 500,
  });

  const initPortionData: ChartTypePortionData[] = [
    { name: 'foo', value: 25 },
    { name: 'bar', value: 35 },
    { name: 'baz', value: 27 },
    { name: 'bat', value: 13 },
  ]

  const [chartGraphData, setChartGraphData] = useState<ChartTypeGraphData[]>([]);
  const [chartPortionData, setChartPortionData] = useState<ChartTypePortionData[]>(initPortionData);
  const [dataAsString, setDataAsString] = useState<string>(JSON.stringify(initPortionData));
  const [queryChartData, setQueryChartData] = useState<QueryChartData>({
    type: 'pie',
    data: chartPortionData,
  });

  const setModeLight = () => setQueryConfig({ ...queryConfig, mode: 'light' });
  const setModeDark = () => setQueryConfig({ ...queryConfig, mode: 'dark' });

  const setWidth = (width: number) => setQueryConfig({ ...queryConfig, width });
  const setHeight = (height: number) => setQueryConfig({ ...queryConfig, height });

  const setChartBar = () => setQueryChartData({ type: 'bar', data: chartGraphData });
  const setChartArea = () => setQueryChartData({ type: 'area', data: chartGraphData });
  const setChartLine = () => setQueryChartData({ type: 'line', data: chartGraphData });
  const setChartPie = () => setQueryChartData({ type: 'pie', data: chartPortionData });

  const setGraphDataAsString = (e: any) => setDataAsString(e.target.value);
  const setPortionDataAsString = (e: any) => setDataAsString(e.target.value);

  const setChartGraphDataFromString = () => {
    const data = JSON.parse(dataAsString) as ChartTypeGraphData[];
    setChartGraphData(data);
    const type = queryChartData.type !== 'pie'
      ? 'bar'
      : queryChartData.type as 'bar' | 'area' | 'line';
    setQueryChartData({ type, data });
  };

  const setChartPortionDataFromString = () => {
    const data = JSON.parse(dataAsString) as ChartTypePortionData[];
    setChartPortionData(data);
    setQueryChartData({ type: 'pie', data });
  };

  useEffect(() => {
    const queryData: QueryData = {
      config: queryConfig,
      chart: queryChartData,
    };
    const stringified = JSON.stringify(queryData);
    const query = window.btoa(stringified);
    const newUrls = {
      client: `${process.env.CLIENT_URL}/chart?query=${query}`,
      server: `${process.env.API_URL}/api/v1/chart?query=${query}`,
    };
    setUrls(newUrls);
  }, [queryConfig, queryChartData]);

  const onSubmit = async () => {
    if (urls.server) await imageDownloader(urls.server);
  };

  const onChangeTextarea = queryChartData.type === 'pie'
    ? setPortionDataAsString
    : setGraphDataAsString;

  const onBlurTextarea = queryChartData.type === 'pie'
    ? setChartPortionDataFromString
    : setChartGraphDataFromString;

  return (
    <div className="page page--home">
      <header className="header">
        <h1>Custom Chart Generator</h1>
      </header>
      <div className="content">
        <div className="content__sections">
          <div className="content__section">
            <h2>Mode</h2>
            <SubmitButton onClick={setModeLight}>Light</SubmitButton>
            <SubmitButton onClick={setModeDark}>Dark</SubmitButton>
          </div>
          <div className="content__section">
            <h2>Dimensions</h2>
            <InputNumber
              label="Width"
              value={queryConfig.width}
              min={0}
              max={1280}
              onChange={setWidth}
            />
            <InputNumber
              label="Height"
              value={queryConfig.height}
              min={0}
              max={1280}
              onChange={setHeight}
            />
          </div>
          <div className="content__section">
            <h2>Chart type</h2>
            <SubmitButton onClick={setChartBar}>Bar</SubmitButton>
            <SubmitButton onClick={setChartArea}>Area</SubmitButton>
            <SubmitButton onClick={setChartLine}>Line</SubmitButton>
            <SubmitButton onClick={setChartPie}>Pie</SubmitButton>
          </div>
          <div className="content__section">
            <h2>Chart data</h2>
            <textarea rows={20} value={dataAsString} onChange={onChangeTextarea} onBlur={onBlurTextarea} />
          </div>
        </div>
        <div className="content__previews">
          <div className="content__preview">
            <code>QueryConfig</code>
            <pre>{JSON.stringify(queryConfig, null, 2)}</pre>
          </div>
          <div className="content__preview">
            <code>QueryChartData</code>
            <pre>{JSON.stringify(queryChartData, null, 2)}</pre>
          </div>
          <div className="content__preview">
            <SubmitButton onClick={onSubmit}>Download</SubmitButton>
            <LinkButton href={urls.client} external>Client</LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
