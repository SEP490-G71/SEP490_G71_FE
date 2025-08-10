import { Stack, Group, Text, Paper, Button, Loader } from "@mantine/core";

export function HistoryList({
  title = "Lịch sử góp ý",
  loading,
  items,
  getLevelLabel,
  getComment,
  getTimeText,
  onReload,
}: {
  title?: string;
  loading: boolean;
  items: any[];
  getLevelLabel: (it: any) => string;
  getComment: (it: any) => string | undefined;
  getTimeText: (it: any) => string;
  onReload: () => void;
}) {
  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <Text fw={600} size="sm">
          {title}
        </Text>
        <Button size="xs" variant="subtle" onClick={onReload}>
          Tải lại
        </Button>
      </Group>

      {loading && (
        <Group gap="xs">
          <Loader size="xs" />
          <Text size="sm">Đang tải...</Text>
        </Group>
      )}

      {!loading && items.length === 0 && (
        <Text size="sm" c="dimmed">
          Chưa có phản hồi nào.
        </Text>
      )}

      {!loading &&
        items.map((it) => (
          <Paper key={it.id} withBorder p="xs" radius="sm">
            <Group justify="space-between" align="start">
              <Stack gap={2} style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {getLevelLabel(it) || "—"}
                </Text>
                <Text size="sm">
                  {getComment(it) || <i>(Không có bình luận)</i>}
                </Text>
              </Stack>
              <Text size="xs" c="dimmed">
                {getTimeText(it)}
              </Text>
            </Group>
          </Paper>
        ))}
    </Stack>
  );
}
