import { Grid, Textarea } from "@mantine/core";

interface Props {
  values: {
    symptoms: string;
    notes: string;
  };
  onChange: (field: keyof Props["values"], value: string) => void;
}

const DiagnosisForm = ({ values, onChange }: Props) => {
  return (
    <Grid gutter="xs" mt="md">
      <Grid.Col span={6}>
        <Textarea
          label="Triệu chứng"
          minRows={2}
          autosize
          value={values.symptoms}
          onChange={(e) => onChange("symptoms", e.target.value)}
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <Textarea
          label="Ghi chú"
          minRows={2}
          autosize
          value={values.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </Grid.Col>
    </Grid>
  );
};

export default DiagnosisForm;
