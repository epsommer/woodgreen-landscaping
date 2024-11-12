import * as React from "react";
import { cn } from "@/lib/utils";

// Define the interface for InputProps, extending the default props for HTML inputs
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Example of a custom property you might want to add
  customLabel?: string; // Add your custom properties here
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, customLabel, ...props }, ref) => {
    return (
      <div>
        {customLabel && <label className="mb-1 text-sm">{customLabel}</label>}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
