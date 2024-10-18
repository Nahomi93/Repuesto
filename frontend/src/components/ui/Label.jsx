import React from 'react';
import '../../styles/styles.css';

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-style">
      {children}
    </label>
  );
}
