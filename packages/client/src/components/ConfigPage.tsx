import * as React from 'react';
import { useState } from 'react';
import { v4 } from 'uuid';
import { SliceType, SliceMap, Slice } from './Slice';
import { IconButton, SubmitButton } from './Buttons';
import { QueryData } from '../App';

function getGuid(prefix: string): string {
  return `${prefix}_${v4()}`;
}

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

const ConfigPage = () => {
  const [slices, setSlices] = useState<SliceMap>({});
  const numSlices = Object.keys(slices).length;
  const totalPercent = Object.values(slices).reduce(
    (total, [, , percent]) => (total += percent),
    0,
  );

  const addSlice = () => {
    const id = getGuid('slice');
    const slice: SliceType = [`Label ${numSlices + 1}`, '#008080', 0];
    setSlices({
      ...slices,
      [id]: slice,
    });
  };

  const setSlice = (id: string, slice: SliceType) => {
    setSlices({
      ...slices,
      [id]: slice,
    });
  };

  const removeSlice = (id: string) => {
    const newSlices = { ...slices };
    delete newSlices[id];
    setSlices(newSlices);
  };

  const onSubmit = async () => {
    if (totalPercent === 100) {
      const queryData: QueryData = {
        size: 400,
        color: '#ccc',
        strokeWidth: 10,
        mode: 'light',
        slices,
      };
      const stringified = JSON.stringify(queryData);
      const encoded = btoa(stringified);
      const url = `${process.env.API_URL}/api/v1/circle?query=${encoded}`;
      console.log(`http://localhost:1234/pie?query=${encoded}`);
      await imageDownloader(url);
    }
  };

  return (
    <div className="page page--config">
      <div className="header">
        <h1>Enter values for a pie chart</h1>
        <IconButton icon="add" onClick={addSlice} />
      </div>
      {numSlices > 0 ? (
        <>
          <div className="slices">
            {Object.entries(slices).map(([id, slice]) => (
              <Slice key={id} id={id} slice={slice} setSlice={setSlice} removeSlice={removeSlice} />
            ))}
          </div>
          <SubmitButton disabled={totalPercent !== 100} onClick={onSubmit}>
            {totalPercent === 100 ? <i className="material-icons">file_download</i> : totalPercent}
          </SubmitButton>
        </>
      ) : null}
    </div>
  );
};

export default ConfigPage;


