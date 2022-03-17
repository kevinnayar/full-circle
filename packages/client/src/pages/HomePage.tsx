import * as React from 'react';
import { useState } from 'react';
import {
  QueryConfig,
  QueryChartData,
  ChartTypeGraphData,
  ChartTypePortionData,
  QueryData,
} from '../components/Charts/Charts';
import { SubmitButton } from '../components/Buttons/Buttons';
import { InputNumber } from '../components/Inputs/Inputs';

const HomePage = () => {
  const [urls, setUrls] = useState<[string, string]>(['', '']);

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
    const parsed = JSON.parse(dataAsString) as ChartTypeGraphData[];
    setChartGraphData(parsed);
  };

  const setChartPortionDataFromString = () => {
    const parsed = JSON.parse(dataAsString) as ChartTypePortionData[];
    setChartPortionData(parsed);
  };

  React.useEffect(() => {
    const queryData: QueryData = {
      config: queryConfig,
      chart: queryChartData,
    };
    const stringified = JSON.stringify(queryData);
    const encoded = btoa(stringified);
    const serverUrl = `${process.env.API_URL}/api/v1/circle?query=${encoded}`;
    const clientUrl = `http://localhost:1234/chart?query=${encoded}`;
    setUrls([clientUrl, serverUrl]);
  }, [queryConfig, queryChartData]);

  // const onSubmit = async () => {
  //   if (totalPercent === 100) {
  //     const queryData: QueryData = {
  //       size: 400,
  //       color: '#ccc',
  //       strokeWidth: 10,
  //       mode: 'light',
  //       slices,
  //     };
  //     const stringified = JSON.stringify(queryData);
  //     const encoded = btoa(stringified);
  //     const url = `${process.env.API_URL}/api/v1/circle?query=${encoded}`;
  //     console.log(`http://localhost:1234/pie?query=${encoded}`);
  //     await imageDownloader(url);
  //   }
  // };

  const textOnChange = queryChartData.type === 'pie'
    ? setPortionDataAsString
    : setGraphDataAsString;
  const textOnBlur = queryChartData.type === 'pie'
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
            <textarea rows={20} onChange={textOnChange} onBlur={textOnBlur}>
              {dataAsString}
            </textarea>
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
            <a href={urls[0]} target="_blank">
              Client
            </a>
          </div>
          <div className="content__preview">
            <a href={urls[1]} target="_blank">
              Server
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;