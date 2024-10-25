import React, { forwardRef } from 'react';
import "../../styles/styles.css"; 

export function Card({ children }) {
  return (
    <div 
      style={{ backgroundColor: '#dcdcdc', maxWidth: '700px' }}
      className="w-full custom-padding rounded-md margin-card margin-top-custom"
    >
      {children}
    </div>
  );
}

