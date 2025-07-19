import { Button, Table, Text } from "@mantine/core";
import { StaffsResponse } from "../../../types/Admin/Staffs/StaffsTypeResponse";
import { IconSquareX } from "@tabler/icons-react";

interface StaffListTableProps {
  staffs: StaffsResponse[];
  onRemove: (staffId: string) => void;
}

const StaffListTable = ({ staffs, onRemove }: StaffListTableProps) => {
  if (staffs.length === 0) {
    return (
      <Text color="dimmed" size="sm" className="text-center">
        Không có nhân viên nào trong phòng này.
      </Text>
    );
  }

  return (
    <Table highlightOnHover verticalSpacing={2} striped withColumnBorders>
      <thead style={{ backgroundColor: "#f1f1f1" }}>
        <tr>
          <th style={{ textAlign: "left", padding: "8px 16px" }}>Họ tên</th>
          <th style={{ textAlign: "left", padding: "8px 16px" }}>
            Mã nhân viên
          </th>
          <th style={{ textAlign: "center", padding: "8px 16px" }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {staffs.map((staff) => (
          <tr key={staff.id}>
            <td style={{ textAlign: "left", padding: "8px 16px" }}>
              {staff.fullName}
            </td>
            <td style={{ textAlign: "left", padding: "8px 16px" }}>
              {staff.staffCode}
            </td>
            <td style={{ textAlign: "center", padding: "8px 16px" }}>
              <Button
                size="sm"
                variant="subtle"
                color="red"
                style={{ height: "auto", padding: 0 }}
                onClick={() => onRemove(staff.id)}
              >
                <IconSquareX size={20} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default StaffListTable;
