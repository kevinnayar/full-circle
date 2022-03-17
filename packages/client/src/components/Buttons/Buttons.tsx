import * as React from 'react';

type IconButtonProps ={
  icon: string,
  onClick: () => void;
};

export const IconButton = ({ icon, onClick }: IconButtonProps) => (
  <button className="btn btn--icon" onClick={onClick}>
    <i className="material-icons">{icon}</i>
  </button>
);

type SubmitButtonProps = {
  children: any;
  disabled?: boolean;
  onClick: () => void;
};

export const SubmitButton = ({ children, disabled, onClick }: SubmitButtonProps) => (
  <button type="submit" disabled={disabled} className="btn btn--submit" onClick={onClick}>
    {children}
  </button>
);
