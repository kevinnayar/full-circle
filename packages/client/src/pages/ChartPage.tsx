import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatError } from '../utils/baseUtils';
import { QueryChart, QueryData } from '../components/Charts/Charts';

const ChartPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [error, setError] = useState<null | string>(null);
  const [queryData, setQueryData] = useState<null | QueryData>(null);

  useEffect(() => {
    try {
      const decoded = atob(query);
      const parsed = JSON.parse(decoded) as QueryData;
      if (!parsed.chart.data.length) {
        throw new Error('Data cannot be empty!');
      }
      setQueryData(parsed);
    } catch (e) {
      setError(formatError(e));
    }
  }, [query]);

  return (
    <div className="page page--chart">
      {error && <p className="error">{error}</p>}
      {!error && queryData && <QueryChart {...queryData} />}
    </div>
  );
};

export default ChartPage;
