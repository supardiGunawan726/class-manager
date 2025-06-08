import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, ComponentProps, ReactNode } from "react";

type FileDropzoneProps = Omit<
  ComponentProps<"input">,
  "children" | "name" | "onDrop"
> & {
  children: ReactNode;
  name: string;
  onDrop: (files: FileList) => void;
};

export function FileDropzone({
  children,
  name,
  onDrop,
  ...props
}: FileDropzoneProps) {
  function handleInputDrop(e: ChangeEvent<HTMLInputElement>) {
    onDrop(e.target.files ?? new FileList());
  }

  return (
    <>
      <Label id={name} className="grid grid-cols-1 grid-rows-1">
        <div className="row-start-1 col-start-1">{children}</div>
        <Input
          type="file"
          id={name}
          name={name}
          value=""
          onChange={handleInputDrop}
          className="row-start-1 col-start-1 h-full opacity-0 cursor-pointer"
          {...props}
        />
      </Label>
    </>
  );
}
