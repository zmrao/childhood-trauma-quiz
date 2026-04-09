import React from "react";

export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});
