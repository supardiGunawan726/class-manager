import { cn } from "@/lib/utils";
import { useFormikContext } from "formik";
import { HTMLAttributes, ReactNode } from "react";

export type FormContainerProps = HTMLAttributes<HTMLFormElement>;

export function Form({ className, ...props }: FormContainerProps) {
  return <form className={cn("grid gap-3", className)} {...props} />;
}

export type InputItemProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  label?: ReactNode;
};

function InputItem({ name, label, children, ...props }: InputItemProps) {
  const { touched: _touched, errors } = useFormikContext() ?? {};
  const error = errors?.[name as keyof typeof errors] ?? "";
  const touched = _touched?.[name as keyof typeof _touched] ?? "";

  return (
    <div {...props}>
      {label && (
        <label htmlFor={name} className="mb-1 inline-block">
          {label}
        </label>
      )}
      {children}
      {error && touched && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

Form.InputItem = InputItem;
