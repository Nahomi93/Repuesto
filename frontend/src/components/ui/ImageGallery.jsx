import React from 'react';

export function ImageGallery({ photos }) {
    console.log(photos);
  const baseUrl = 'http://localhost:4000/';
  return (
    <div className="flex flex-wrap gap-2">
      {photos.map((photo, index) => (
        <div key={index} className="w-20 h-20 overflow-hidden border rounded-md shadow-sm">
          <img 
            src={`${baseUrl}${photo}`} 
            alt={`Foto ${index + 1}`} 
            className="w-full h-full object-cover" 
          />
        </div>
      ))}
    </div>
  );
}