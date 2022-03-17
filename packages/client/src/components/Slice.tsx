import * as React from 'react';
import { InputText, InputColor, InputNumber } from './Inputs/Inputs';
import { IconButton } from './Buttons/Buttons';

export type SliceType = [string, string, number]; // [label, color, percentage]

export type SliceMap = Record<string, SliceType>;

type SliceProps = {
  id: string;
  slice: SliceType;
  setSlice: (id: string, slice: SliceType) => void;
  removeSlice: (id: string) => void;
};

export const Slice = ({ id, slice, setSlice, removeSlice }: SliceProps) => {
  const [label, color, percent] = slice;

  const onChangeLabel = (l: string) => setSlice(id, [l, color, percent]);
  const onChangeColor = (c: string) => setSlice(id, [label, c, percent]);
  const onChangePercent = (p: number) => setSlice(id, [label, color, p]);
  const onRemoveSlice = () => removeSlice(id);

  return (
    <div key={id} className="slice">
      <InputText value={label} onChange={onChangeLabel} customClassName="label" />
      <InputColor value={color} onChange={onChangeColor} customClassName="color" />
      <InputNumber
        value={percent}
        onChange={onChangePercent}
        customClassName="percent"
        min={0}
        max={100}
      />
      <IconButton icon="remove" onClick={onRemoveSlice} />
    </div>
  );
};
