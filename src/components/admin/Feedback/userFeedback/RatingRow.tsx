import { Group, Select, TextInput, Button } from "@mantine/core";
import { SatisfactionLevel } from "../../../../enums/FeedBack/SatisfactionLevel";

export type RatingRowState = {
  level: SatisfactionLevel | null;
  comment: string;
  sending?: boolean;
};

export function RatingRow({
  levelOptions,
  state,
  onChange,
  onSubmit,
  submitLabel,
  disabled,
}: {
  levelOptions: { value: SatisfactionLevel; label: string }[];
  state: RatingRowState;
  onChange: (patch: Partial<RatingRowState>) => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
}) {
  return (
    <Group gap="sm" wrap="nowrap" align="center">
      <Select
        style={{ minWidth: 200 }}
        placeholder="Mức hài lòng"
        data={levelOptions}
        value={state.level ?? null}
        onChange={(v) => onChange({ level: (v as SatisfactionLevel) ?? null })}
        clearable
      />

      <TextInput
        style={{ flex: 1 }}
        placeholder="Nhập bình luận (tuỳ chọn)"
        value={state.comment ?? ""}
        onChange={(e) => onChange({ comment: e.currentTarget.value })}
      />

      <Button onClick={onSubmit} loading={!!state.sending} disabled={disabled}>
        {submitLabel}
      </Button>
    </Group>
  );
}
