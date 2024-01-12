import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FileDropzone({ children, name, onDrop, ...props }) {
  function handleInputDrop(e) {
    onDrop(e.target.files);
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
