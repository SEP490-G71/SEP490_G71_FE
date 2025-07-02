import { Input } from "@mantine/core";
import { ReactNode } from "react";

interface FloatingLabelWrapperProps {
  label: string;
  children: ReactNode;
}

export const FloatingLabelWrapper = ({
  label,
  children,
}: FloatingLabelWrapperProps) => {
  return (
    <Input.Wrapper
      label={label}
      styles={{
        root: {
          position: "relative",
          marginTop: 20,
        },
        label: {
          position: "absolute",
          top: -10,
          left: 12,
          backgroundColor: "#fff",
          padding: "0 6px",
          fontSize: 13,
          fontWeight: 600,
          color: "#228be6",
          zIndex: 10,
          lineHeight: 1,
        },
      }}
    >
      {children}
    </Input.Wrapper>
  );
};
