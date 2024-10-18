
import { useState  } from "react";

export function StarRating({ onChange }) {
    const [rating, setRating] = useState(0);
    // Función para manejar el cambio de estrellas
    const handleSetRating = (rate) => {
      setRating(rate);
      if (onChange) {
        onChange(rate);
      }
    };
  
    return (
      <div>
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => handleSetRating(ratingValue)}
                style={{ display: 'none' }}
              />
              <span style={{ cursor: 'pointer', color: ratingValue <= rating ? '#ffc107' : '#ffffff',
                fontSize: '3rem'}}>★</span>
            </label>
          );
        })}
      </div>
    );
  }
  