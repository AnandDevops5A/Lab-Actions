import { Star } from "lucide-react";

 export function StarRating({ value, onChange, size = 'md', readOnly = false, label }) {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };
    return (
      <div className="flex items-center gap-1" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => !readOnly && onChange?.(n)}
            className={`transition-transform ${readOnly ? 'cursor-default' : 'hover:scale-110'}`}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              className={`${sizes[size]} ${
                n <= value
                  ? 'fill-red-500 drop-shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                  : 'fill-transparent'
              } text-red-400`}
              strokeWidth={1}
            />
          </button>
        ))}
      </div>
    );
  }
