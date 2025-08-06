import { Grid, TextInput, Select, Button, Group, Loader } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";

export type FilterField<T = any> = {
  key: keyof T | string;
  label: string;
  placeholder?: string;
  type?: "text" | "select" | "date";
  options?: { value: string; label: string }[];
  wrapper?: React.ComponentType<{ label: string; children: React.ReactNode }>;
  customRender?: (props: {
    value: any;
    onChange: (val: any) => void;
    loading: boolean;
  }) => React.ReactNode;
};

interface Props<T = any> {
  fields: FilterField<T>[];
  onSearch: (filters: T) => void;
  onReset: () => void;
  initialValues: T;
  resetTrigger?: T;
}

const FilterPanel = <T extends Record<string, any>>({
  fields,
  onSearch,
  onReset,
  initialValues,
  resetTrigger,
}: Props<T>) => {
  const [filters, setFilters] = useState<T>(initialValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resetTrigger) {
      setFilters(initialValues);
    }
  }, [resetTrigger]);

  const handleChange = (key: keyof T, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      await onSearch(filters);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      setFilters(initialValues);
      await onReset();
    } finally {
      setLoading(false);
    }
  };
  const renderField = (field: FilterField<T>) => {
    const Wrapper = field.wrapper ?? (({ children }) => <>{children}</>);
    const key = field.key as keyof T;
    const value = filters[key];

    if (field.customRender) {
      return field.customRender({
        value,
        onChange: (val) => handleChange(key, val),
        loading,
      });
    }

    // Default render theo type
    if (field.type === "text") {
      return (
        <Wrapper label={field.label}>
          <TextInput
            placeholder={field.placeholder}
            value={value ?? ""}
            onChange={(e) => handleChange(key, e.currentTarget.value)}
            disabled={loading}
          />
        </Wrapper>
      );
    }

    if (field.type === "select") {
      return (
        <Wrapper label={field.label}>
          <Select
            placeholder={field.placeholder}
            data={field.options || []}
            value={value ?? null}
            onChange={(v) => handleChange(key, v)}
            clearable
            disabled={loading}
          />
        </Wrapper>
      );
    }

    if (field.type === "date") {
      return (
        <Wrapper label={field.label}>
          <DatePickerInput
            placeholder={field.placeholder}
            value={value ?? null}
            onChange={(v) => handleChange(key, v)}
            valueFormat="DD/MM/YYYY"
            clearable
            disabled={loading}
          />
        </Wrapper>
      );
    }

    return null;
  };

  return (
    <Grid gutter="xs">
      {fields.map((field) => (
        <Grid.Col span={6} key={field.key.toString()}>
          {renderField(field)}
        </Grid.Col>
      ))}

      <Grid.Col span={12}>
        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={handleReset} disabled={loading}>
            {loading ? <Loader size="xs" color="gray" /> : "Tải lại"}
          </Button>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader size="xs" color="white" /> : "Tìm kiếm"}
          </Button>
        </Group>
      </Grid.Col>
    </Grid>
  );
};

export default FilterPanel;
