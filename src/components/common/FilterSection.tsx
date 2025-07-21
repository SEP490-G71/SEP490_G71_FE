import {
  Grid,
  Select,
  TextInput,
  Paper,
  Button,
  Group,
  Loader,
} from "@mantine/core";
import { FloatingLabelWrapper } from "../../components/common/FloatingLabelWrapper";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import { Status } from "../../enums/Queue-Patient/Status";

type Props = {
  onSearch: (filters: any) => void;
  onReset: () => void;
};

const FilterPanel = ({ onSearch, onReset }: Props) => {
  const today = new Date();

  const defaultFilters = {
    name: "",
    phone: "",
    patientCode: "",
    status: "",
    registeredTimeFrom: today,
    registeredTimeTo: today,
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
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
      setFilters(defaultFilters);
      await onReset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" radius="md" mb="md" withBorder>
      <Grid gutter="xs">
        <Grid.Col span={6}>
          <FloatingLabelWrapper label="Trạng thái">
            <Select
              placeholder="Chọn trạng thái"
              data={Object.values(Status).map((value) => ({
                value,
                label: value,
              }))}
              value={filters.status}
              onChange={(v) => handleChange("status", v)}
              clearable
              disabled={loading}
            />
          </FloatingLabelWrapper>
        </Grid.Col>

        <Grid.Col span={6}>
          <FloatingLabelWrapper label="Họ tên">
            <TextInput
              placeholder="Nhập họ tên"
              value={filters.name}
              onChange={(e) => handleChange("name", e.currentTarget.value)}
              disabled={loading}
            />
          </FloatingLabelWrapper>
        </Grid.Col>

        <Grid.Col span={6}>
          <FloatingLabelWrapper label="Từ ngày">
            <DatePickerInput
              placeholder="Chọn ngày bắt đầu"
              value={filters.registeredTimeFrom}
              onChange={(v) => handleChange("registeredTimeFrom", v)}
              valueFormat="DD/MM/YYYY"
              clearable
              disabled={loading}
            />
          </FloatingLabelWrapper>
        </Grid.Col>

        <Grid.Col span={6}>
          <FloatingLabelWrapper label="Đến ngày">
            <DatePickerInput
              placeholder="Chọn ngày kết thúc"
              value={filters.registeredTimeTo}
              onChange={(v) => handleChange("registeredTimeTo", v)}
              valueFormat="DD/MM/YYYY"
              clearable
              disabled={loading}
            />
          </FloatingLabelWrapper>
        </Grid.Col>

        <Grid.Col span={6}>
          <FloatingLabelWrapper label="Mã BN">
            <TextInput
              placeholder="Nhập mã BN"
              value={filters.patientCode}
              onChange={(e) =>
                handleChange("patientCode", e.currentTarget.value)
              }
              disabled={loading}
            />
          </FloatingLabelWrapper>
        </Grid.Col>

        <Grid.Col span={6}>
          <FloatingLabelWrapper label="Số điện thoại">
            <TextInput
              placeholder="Nhập số điện thoại"
              value={filters.phone}
              onChange={(e) => handleChange("phone", e.currentTarget.value)}
              disabled={loading}
            />
          </FloatingLabelWrapper>
        </Grid.Col>

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
    </Paper>
  );
};

export default FilterPanel;
