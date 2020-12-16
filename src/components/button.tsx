import React from 'react';

interface IButtonProps {
  isValid: boolean;
  loading: boolean;
  text: string;
}

export const Button: React.FC<IButtonProps> = ({ isValid, loading, text }) => (
  <button className={`btn ${isValid ? '' : 'bg-gray-200 pointer-events-none'}`}>
    {loading ? 'Loading...' : text}
  </button>
);
