import * as React from "react";

import { cn } from "@/lib/utils";
import { useFormikContext } from "formik";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, name, ...props }, ref) => {
    const { touched: _touched, errors } = useFormikContext() ?? {};
    const error = errors?.[name as keyof typeof errors] ?? "";
    const touched = _touched?.[name as keyof typeof _touched] ?? "";

    return (
      <input
        aria-invalid={error && touched}
        name={name}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground invalid:border-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
