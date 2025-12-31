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
            <svg
              className={`${sizes[size]} ${
                n <= value
                  ? 'fill-red-500 drop-shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                  : 'fill-transparent'
              } stroke-red-400`}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 4.27 1.402-8.168L.132 9.211l8.2-1.193L12 .587z"
                strokeWidth="1"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  }
