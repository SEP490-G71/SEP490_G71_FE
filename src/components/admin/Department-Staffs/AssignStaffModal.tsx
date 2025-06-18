import {
  Modal,
  Table,
  Button,
  Loader,
  Text,
  Checkbox,
  Flex,
  MultiSelect,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { StaffsResponse } from "../../../types/Admin/Staffs/StaffsTypeResponse";
import useAssignStaffsToDepartment from "../../../hooks/department-Staffs/useAssignStaffsToDepartment";
import { Position } from "../../../enums/Admin/Position";
import { toast } from "react-toastify";

interface AssignStaffModalProps {
  opened: boolean;
  onClose: () => void;
  departmentId: string;
  onAssigned: () => void;
}

interface AssignStaffMultiplePosition {
  staffId: string;
  positions: (keyof typeof Position)[];
}

const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  opened,
  onClose,
  departmentId,
  onAssigned,
}) => {
  const [staffs, setStaffs] = useState<StaffsResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedStaffs, setSelectedStaffs] = useState<
    AssignStaffMultiplePosition[]
  >([]);

  const [staffToRemoveId, setStaffToRemoveId] = useState<string | null>(null);
  const [invalidStaffIds, setInvalidStaffIds] = useState<string[]>([]);

  const { assignStaffs, loading: assigning } = useAssignStaffsToDepartment();

  const fetchUnassignedStaff = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/staffs/unassigned`);
      setStaffs(res.data.result || []);
      setSelectedStaffs([]);
      setStaffToRemoveId(null);
      setInvalidStaffIds([]);
    } catch (error) {
      console.error("Lỗi khi tải nhân viên chưa gán:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (staffId: string) => {
    setSelectedStaffs((prev) => {
      const exists = prev.find((s) => s.staffId === staffId);
      if (exists) {
        return prev.filter((s) => s.staffId !== staffId);
      } else {
        return [...prev, { staffId, positions: [] }];
      }
    });
  };

  const updatePositions = (staffId: string, positions: string[]) => {
    setSelectedStaffs((prev) =>
      prev.map((s) =>
        s.staffId === staffId
          ? { ...s, positions: positions as (keyof typeof Position)[] }
          : s
      )
    );
  };

  const handleAssignSelected = async () => {
    if (!departmentId || selectedStaffs.length === 0) return;

    const invalids = selectedStaffs.filter((s) => s.positions.length === 0);
    const invalidIds = invalids.map((s) => s.staffId);

    if (invalidIds.length > 0) {
      setInvalidStaffIds(invalidIds);
      const invalidNames = staffs
        .filter((s) => invalidIds.includes(s.id))
        .map((s) => s.name)
        .join(", ");
      toast.error(`Vui lòng chọn chức vụ cho: ${invalidNames}`);
      return;
    }

    setInvalidStaffIds([]); // clear lỗi nếu hợp lệ

    const formatted: { staffId: string; position: keyof typeof Position }[] =
      [];

    selectedStaffs.forEach((s) => {
      s.positions.forEach((p) => {
        formatted.push({ staffId: s.staffId, position: p });
      });
    });

    const result = await assignStaffs(departmentId, formatted);
    if (result) {
      onAssigned();
      onClose();
    }
  };

  useEffect(() => {
    if (opened) fetchUnassignedStaff();
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Gán nhân viên vào phòng"
      size="lg"
    >
      {loading ? (
        <Loader />
      ) : staffs.length === 0 ? (
        <Text>Không có nhân viên nào chưa gán phòng.</Text>
      ) : (
        <>
          <Flex justify="space-between" align="center" mb="sm">
            <Text size="sm" fw={500}>
              Đã chọn: {selectedStaffs.length} nhân viên
            </Text>
            <Button
              size="sm"
              loading={assigning}
              onClick={handleAssignSelected}
              disabled={selectedStaffs.length === 0}
            >
              Gán vào phòng
            </Button>
          </Flex>

          <Table
            verticalSpacing="sm"
            highlightOnHover
            style={{
              borderCollapse: "separate",
              borderSpacing: "0 8px",
              fontSize: "14px",
            }}
          >
            <thead style={{ backgroundColor: "#f9f9f9" }}>
              <tr>
                <th style={{ textAlign: "left", padding: "8px" }}></th>
                <th style={{ textAlign: "left", padding: "8px" }}>Họ tên</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Email</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Chức vụ</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => {
                const isSelected = selectedStaffs.some(
                  (s) => s.staffId === staff.id
                );
                const current = selectedStaffs.find(
                  (s) => s.staffId === staff.id
                );
                const currentPositions = current?.positions || [];

                const rowError = invalidStaffIds.includes(staff.id);

                return (
                  <tr
                    key={staff.id}
                    style={{
                      backgroundColor: rowError ? "#ffe6e6" : "transparent",
                    }}
                  >
                    <td style={{ textAlign: "left", padding: "8px" }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleSelection(staff.id)}
                      />
                    </td>
                    <td style={{ textAlign: "left", padding: "8px" }}>
                      {staff.name}
                    </td>
                    <td style={{ textAlign: "left", padding: "8px" }}>
                      {staff.email}
                    </td>
                    <td
                      style={{ textAlign: "left", padding: "8px", width: 220 }}
                    >
                      <MultiSelect
                        data={Object.keys(Position).map((key) => ({
                          value: key,
                          label: Position[key as keyof typeof Position],
                        }))}
                        value={currentPositions}
                        onChange={(value) => updatePositions(staff.id, value)}
                        placeholder="Chọn chức vụ"
                        size="xs"
                        disabled={!isSelected}
                        error={
                          rowError &&
                          isSelected &&
                          currentPositions.length === 0
                            ? "Bắt buộc"
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </Modal>
  );
};

export default AssignStaffModal;
