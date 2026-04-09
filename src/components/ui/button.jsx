import React from "react";

const variants = {
  default: "bg-primary text-primary-foreground hover:opacity-95",
  outline: "border border-border bg-background hover:bg-muted/60",
  ghost: "bg-transparent hover:bg-muted/60",
};

export const Button = React.forwardRef(function Button(
  { className = "", variant = "default", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    />
  );
});
