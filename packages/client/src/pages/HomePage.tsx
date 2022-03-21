import * as React from 'react';
import { useState } from 'react';
import {
  QueryConfig,
  QueryChartData,
  ChartTypeGraphData,
  ChartTypePortionData,
  QueryData,
} from '../components/Charts/Charts';
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

  const [dataAsString, setDataAsString] = useState<string>('');
  const [chartGraphData, setChartGraphData] = useState<ChartTypeGraphData[]>([]);
  const [chartPortionData, setChartPortionData] = useState<ChartTypePortionData[]>([]);

  const [queryChartData, setQueryChartData] = useState<QueryChartData>({
    type: 'bar',
    data: chartGraphData,
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

  React.useEffect(() => {
    const queryData: QueryData = {
      config: queryConfig,
      chart: queryChartData,
    };
    const stringified = JSON.stringify(queryData);
    const query = window.btoa(stringified);
    const newUrls = {
      client: `http://localhost:1234/chart?query=${query}`,
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
        <h1>configure a custom chart</h1>
      </header>
      <div className="content">
        <div className="content__sections">
          <div className="content__section">
            <h2>Select mode</h2>
            <SubmitButton onClick={setModeLight}>Light</SubmitButton>
            <SubmitButton onClick={setModeDark}>Dark</SubmitButton>
          </div>
          <div className="content__section">
            <h2>Select dimensions</h2>
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
            <h2>Select chart type</h2>
            <SubmitButton onClick={setChartBar}>Bar</SubmitButton>
            <SubmitButton onClick={setChartArea}>Area</SubmitButton>
            <SubmitButton onClick={setChartLine}>Line</SubmitButton>
            <SubmitButton onClick={setChartPie}>Pie</SubmitButton>
          </div>
          <div className="content__section">
            <h2>Enter data</h2>
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
            <LinkButton href={urls.server} external>Server</LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;