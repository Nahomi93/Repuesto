import React, { forwardRef } from 'react';
import "../../styles/styles.css"; 

export function Card({ children }) {
  return (
    <div 
      style={{ backgroundColor: '#dcdcdc', maxWidth: '650px' }}
      className="w-full custom-padding rounded-md margin-card margin-top-custom"
    >
      {children}
    </div>
  );
}

