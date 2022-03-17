import * as React from 'react';
import { useState } from 'react';
import { BlockPicker } from 'react-color';

type InputProps<T extends number | string | boolean> = {
  label?: string;
  customClassName?: string;
  value: T;
  onChange: (v: T) => void;
};

export const InputText = ({ label, customClassName, value, onChange }: InputProps<string>) => {
  const [localValue, setLocalValue] = useState(value);

  const onChangeInput = (e: any) => {
    setLocalValue(e.target.value);
  };

  const onBlurInput = () => {
    const newValue = localValue.trim();
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`input ${customClassName ? `input--${customClassName}` : ''}`}>
      {label && <label className="input__label">{label}</label>}
      <input
        className="input__field"
        type="text"
        value={localValue}
        onChange={onChangeInput}
        onBlur={onBlurInput}
      />
    </div>
  );
};

export const InputColor = ({ label, customClassName, value, onChange }: InputProps<string>) => {
  const [pickerVisible, setPickerVisibility] = useState(false);

  const onClick = () => setPickerVisibility(!pickerVisible);
  const onChangeComplete = ({ hex }: { hex: string }) => onChange(hex);

  return (
    <div className={`input ${customClassName ? `input--${customClassName}` : ''}`}>
      {label && <label className="input__label">{label}</label>}
      <div className="input__field" style={{ background: value }} onClick={onClick}>
        {value}
        {pickerVisible && <BlockPicker color={value} onChangeComplete={onChangeComplete} />}
      </div>
    </div>
  );
};

type InputNumberProps = InputProps<number> & {
  min?: number;
  max?: number;
};

export const InputNumber = ({ label, customClassName, value, onChange, min, max }: InputNumberProps) => {
  const [localValue, setLocalValue] = useState<number>(value);

  const onChangeInput = (e: any) => {
    const numValue = parseInt(e.target.value, 10);
    setLocalValue(numValue);
  };

  const onBlurInput = () => {
    const numValue = !Number.isFinite(localValue) ? 0 : localValue;
    onChange(numValue);
    if (numValue !== localValue) setLocalValue(numValue);
  };

  return (
    <div className={`input ${customClassName ? `input--${customClassName}` : ''}`}>
      {label && <label className="input__label">{label}</label>}
      <input
        className="input__field"
        type="number"
        value={localValue}
        min={typeof min !== undefined ? min : -Infinity}
        max={typeof max !== undefined ? max : Infinity}
        onChange={onChangeInput}
        onBlur={onBlurInput}
      />
    </div>
  );
};
