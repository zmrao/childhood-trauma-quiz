import React from "react";

export const Progress = React.forwardRef(function Progress(
  { className = "", value = 0, ...props },
  ref
) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden rounded-full bg-muted ${className}`}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
});
