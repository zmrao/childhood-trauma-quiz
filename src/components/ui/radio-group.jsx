import React, { createContext, useContext, useId } from "react";

const RadioGroupContext = createContext(null);

export function RadioGroup({ value, onValueChange, className = "", children }) {
  const generatedName = useId();

  return (
    <RadioGroupContext.Provider value={{ name: generatedName, value, onValueChange }}>
      <div className={className}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

export const RadioGroupItem = React.forwardRef(function RadioGroupItem(
  { value, className = "", ...props },
  ref
) {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem must be used inside RadioGroup");
  }

  return (
    <input
      ref={ref}
      type="radio"
      name={context.name}
      checked={context.value === value}
      onChange={() => context.onValueChange(value)}
      className={`h-4 w-4 accent-[hsl(var(--primary))] ${className}`}
      {...props}
    />
  );
});
