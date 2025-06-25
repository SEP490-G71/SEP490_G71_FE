import { Grid, Select, TextInput, Paper } from "@mantine/core";

const FilterPanel = () => {
  return (
    <Paper shadow="xs" p="md" radius="md" mb="md" withBorder>
      <Grid gutter="xs">
        <Grid.Col span={6}>
          <Select label="Trạng thái" placeholder="Chọn trạng thái" data={[]} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Từ ngày" placeholder="dd/mm/yyyy" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Đến ngày" placeholder="dd/mm/yyyy" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Họ tên" placeholder="Nhập họ tên" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Mã BN" placeholder="Nhập mã BN" />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Phòng đăng ký"
            placeholder="Chọn phòng"
            data={["Phòng nội tổng quát", "Phòng tim mạch"]}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default FilterPanel;
