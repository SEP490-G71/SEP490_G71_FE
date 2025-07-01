import { Title, Table, Button, Group, Text, Center } from "@mantine/core";
import { FaFolderOpen } from "react-icons/fa6";

interface ServiceTableProps {
  title?: string;
  color?: string;
  headers: string[];
  data: any[];
  emptyMessage?: string;
  type: "pending" | "done";
  onAction?: (item: any) => void;
  centeredColumns?: number[];
}

const thStyle =
  "whitespace-nowrap text-left font-semibold bg-gray-50 text-gray-700 px-3 py-2 border border-gray-300";
const tdStyle = "px-3 py-2 border border-gray-200 whitespace-nowrap";

const ServiceTableSection = ({
  title,
  color = "blue",
  headers,
  data,
  emptyMessage = "Không có dữ liệu",
  type,
  onAction,
  centeredColumns = [],
}: ServiceTableProps) => {
  return (
    <div className="mb-4">
      {title && (
        <Title order={5} mb="xs" c={color}>
          {title}
        </Title>
      )}

      <div className="overflow-x-auto">
        <Table className="min-w-[700px] text-sm" highlightOnHover striped>
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={thStyle}
                  style={{
                    textAlign: centeredColumns.includes(idx)
                      ? "center"
                      : "left",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length}>
                  <Center py="md" c="dimmed">
                    <FaFolderOpen size={24} style={{ marginRight: 8 }} />
                    <Text size="sm">{emptyMessage}</Text>
                  </Center>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowData =
                  type === "pending"
                    ? [
                        index + 1,
                        item.serviceName,
                        item.createdBy ?? "—", // ensure always 1 td
                        <Group gap={4} justify="center">
                          <Button
                            size="xs"
                            color="blue"
                            radius="sm"
                            onClick={() => onAction?.(item)}
                          >
                            Lập kết quả
                          </Button>
                        </Group>,
                      ]
                    : [
                        index + 1,
                        item.serviceName,
                        item.completedBy ?? "—", // also same index
                        <Group gap={4} justify="center">
                          <Button
                            size="xs"
                            color="blue"
                            radius="sm"
                            onClick={() => onAction?.(item)}
                          >
                            Xem kết quả
                          </Button>
                        </Group>,
                      ];

                return (
                  <tr
                    key={item.id || index}
                    className="hover:bg-blue-50 transition"
                  >
                    {rowData.map((cell, colIdx) => (
                      <td
                        key={colIdx}
                        className={tdStyle}
                        style={{
                          textAlign: centeredColumns.includes(colIdx)
                            ? "center"
                            : "left",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ServiceTableSection;
