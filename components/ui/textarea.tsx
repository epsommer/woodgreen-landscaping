import * as React from "react";
import { cn } from "@/lib/utils";

// Define the interface for TextareaProps, extending the default props for HTML textareas
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Example of a custom property you might want to add
  customPlaceholder?: string; // Add your custom properties here
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, customPlaceholder, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        placeholder={customPlaceholder} // Use the custom placeholder if provided
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
