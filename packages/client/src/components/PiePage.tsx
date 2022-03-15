import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SliceType } from './Slice';
import { QueryData } from './App';

type Point = [number, number]; // [x, y]

type SliceMaskData = {
  slice: SliceType;
  begin: Point;
  middle: Point;
  end: Point;
  largeArc: 0 | 1;
};

function getSliceMaskData(size: number, slice: SliceType): SliceMaskData {
  const percent: number = slice[2];
  const half = size / 2;
  const degrees = 360 * (percent / 100);
  const radians = degrees * (Math.PI / 180);
  const x = half + half * Math.cos(radians);
  const y = half + half * Math.sin(radians);

  const begin: Point = [half, half];
  const middle: Point = [size, half];
  const end: Point = [x, y];
  const largeArc = percent > 50 ? 0 : 1;

  return {
    slice,
    begin,
    middle,
    end,
    largeArc,
  };
}

const PieChart = ({ size, color, slices, strokeWidth, mode }: QueryData) => {
  const sliceList = Object.values(slices);

  if (sliceList.reduce((total, [, , percent]) => (total += percent), 0) !== 100) {
    throw new Error(`The sum of all PieChart slices must equal 100`);
  }

  const half = size / 2;
  const strokeWidthPercentage = strokeWidth ? half * (strokeWidth / 100) : null;

  return (
    <div className={`svg-wrapper svg-wrapper--${mode}-mode`} style={{ width: size }}>
      <svg
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        className="pie-chart"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <mask id="circleMask">
          <rect x="0" y="0" width={size} height={size} fill="white" />
          {strokeWidthPercentage && (
            <circle cx={half} cy={half} r={half - strokeWidthPercentage} fill="black" />
          )}
        </mask>
        <circle r={half} cx={half} cy={half} fill={color} mask="url(#circleMask)" />
        {sliceList.map((slice, index) => {
          const maskId = `pieMask_${index}`;
          const data = getSliceMaskData(size, slice);

          let rotateDegrees = 0;
          for (let i = 0; i < sliceList.length; i += 1) {
            if (i === index) break;

            const slicePercent = sliceList[i][2] / 100;
            rotateDegrees += 360 * slicePercent;
          }

          const style = rotateDegrees
            ? {
                transform: `rotate(${rotateDegrees}deg)`,
                transformOrigin: 'center',
              }
            : {};

          return (
            <g key={index} style={style}>
              <mask id={maskId}>
                <rect x="0" y="0" width={size} height={size} fill="white" />
                <path
                  d={`M ${data.begin[0]} ${data.begin[1]} L ${data.middle[0]} ${data.middle[1]} A ${half} ${half} 0 ${data.largeArc} 0 ${data.end[0]} ${data.end[1]} `}
                  fill="black"
                />
                {strokeWidthPercentage && (
                  <circle cx={half} cy={half} r={half - strokeWidthPercentage} fill="black" />
                )}
              </mask>
              <circle
                key={index}
                r={half}
                cx={half}
                cy={half}
                fill={slice[1]}
                mask={`url(#${maskId})`}
              />
            </g>
          );
        })}
      </svg>
      <div className="labels">
        {sliceList.map(([label, color, percent], index) => (
          <div key={`${label}.${color}.${percent}.${index}`} className="label">
            <div style={{ background: color }} className="label__dot" />
            <p className="label__text">
              {label}: {percent}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

function formatError(error: any, fallback?: string): string {
  if (typeof error === 'object' && 'message' in error) return error.message.toString();
  if (typeof error === 'string') return error;
  return fallback || 'An unkown error occurred';
}

const PiePage = () => {
  const [error, setError] = useState<null | string>(null);
  const [queryData, setQueryData] = useState<null | QueryData>(null);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  useEffect(() => {
    try {
      const decoded = atob(query);
      const parsed = JSON.parse(decoded) as QueryData;
      setQueryData(parsed);
    } catch (e) {
      const err = formatError(e);
      setError(err);
    }
  }, [query]);

  return (
    <div className="page page--pie">
      {queryData && (
        <PieChart {...queryData} />
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PiePage;


