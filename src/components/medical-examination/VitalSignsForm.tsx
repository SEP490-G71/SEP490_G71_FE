import { Grid, TextInput } from "@mantine/core";

const VitalSignsForm = () => {
  return (
    <>
      <Grid gutter="xs">
        <Grid.Col span={3}>
          <TextInput label="Nhiệt độ" />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput label="Nhịp thở" />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput label="Huyết áp" />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput label="Mạch" />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput label="Chiều cao" />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput label="Cân nặng" />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput label="BMI" />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput label="SPO2" />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default VitalSignsForm;
