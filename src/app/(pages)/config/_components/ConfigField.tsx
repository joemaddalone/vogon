import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Configuration } from "@/lib/types";

export const ConfigField = ({
  configData,
  label,
  hint,
  dataKey,
  placeholder,
  required,
	type = "text",
  children
}: {
  configData: Configuration;
  label: string;
  hint: string;
  dataKey: keyof Configuration;
  placeholder: string;
  required: boolean;
  children: React.ReactNode;
  type?: "text" | "password" | "email";
}) => {
  return (
    <Field>
      <FieldLabel htmlFor={dataKey}>
        {label}
        <span className="text-xs text-muted-foreground">{hint}</span>
      </FieldLabel>
      <Input
        className="h-12 px-3 text-lg"
        id={dataKey}
        type={type}
        name={dataKey}
        defaultValue={configData[dataKey] as string | undefined || ""}
        placeholder={placeholder}
        required={required}
      />
      <FieldDescription>{children}</FieldDescription>
    </Field>
  );
};
