import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  label: string;
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ label, value, onChange, readonly = false }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-bold text-stone-600">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            className={`transition-transform ${!readonly && 'hover:scale-125 active:scale-95'}`}
          >
            <Star
              size={24}
              fill={star <= value ? "#FF8400" : "transparent"}
              color={star <= value ? "#FF8400" : "#D1D5DB"}
              strokeWidth={2.5}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
