import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatError } from '../utils/baseUtils';
import { QueryChart } from '../components/Charts/Charts';
import { QueryData } from '../types/baseTypes'

const ChartPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [error, setError] = useState<null | string>(null);
  const [queryData, setQueryData] = useState<null | QueryData>(null);

  useEffect(() => {
    try {
      const decoded = window.atob(query);
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
