import * as React from 'react';

type IconButtonProps = {
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

type LinkButtonProps = {
  children: any;
  href: string;
  external?: boolean;
};

export const LinkButton = ({ children, href, external }: LinkButtonProps) => {
  const props = {
    href,
    ...(external ? { target: '_blank' } : {}),
  };
  return (
    <a className="btn btn--link" {...props}>
      {children}
    </a>
  );
};


