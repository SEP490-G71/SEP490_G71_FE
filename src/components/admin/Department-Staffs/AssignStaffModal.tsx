import {
  Modal,
  Table,
  Button,
  Loader,
  Text,
  Checkbox,
  Flex,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import useAssignStaffsToDepartment from "../../../hooks/department-Staffs/useAssignStaffsToDepartment";
import useUnassignedStaffs from "../../../hooks/department-Staffs/useUnassignedStaffs";

interface AssignStaffModalProps {
  opened: boolean;
  onClose: () => void;
  departmentId: string;
  onAssigned: () => void;
}

interface AssignStaff {
  staffId: string;
}

const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  opened,
  onClose,
  departmentId,
  onAssigned,
}) => {
  const { staffs, loading, fetchUnassignedStaffs } = useUnassignedStaffs();
  const { assignStaffs, loading: assigning } = useAssignStaffsToDepartment();

  const [selectedStaffs, setSelectedStaffs] = useState<AssignStaff[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredStaffs, setFilteredStaffs] = useState(staffs);

  const toggleSelection = (staffId: string) => {
    setSelectedStaffs((prev) => {
      const exists = prev.find((s) => s.staffId === staffId);
      return exists
        ? prev.filter((s) => s.staffId !== staffId)
        : [...prev, { staffId }];
    });
  };

  const handleAssignSelected = async () => {
    if (!departmentId || selectedStaffs.length === 0) return;

    const staffIds = selectedStaffs.map((s) => s.staffId);
    const result = await assignStaffs(departmentId, staffIds);

    if (result) {
      onAssigned();
      onClose();
    }
  };

  const handleSearch = () => {
    setFilteredStaffs(
      staffs.filter((staff) =>
        `${staff.firstName} ${staff.middleName} ${staff.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredStaffs(staffs);
    setSelectedStaffs([]);
  };

  useEffect(() => {
    if (opened) {
      fetchUnassignedStaffs();
      setSearchTerm("");
      setSelectedStaffs([]);
    }
  }, [opened]);

  useEffect(() => {
    setFilteredStaffs(
      staffs.filter((staff) =>
        `${staff.firstName} ${staff.middleName} ${staff.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [staffs]);

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
          <Flex mb="sm" gap="sm" justify="flex-start" align="flex-start">
            <TextInput
              placeholder="Tìm kiếm nhân viên theo tên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb="sm"
              style={{
                flex: 1,
                height: 36,
                lineHeight: "36px",
                marginRight: "10px",
                marginTop: "1px",
              }}
            />
            <Button
              variant="light"
              color="gray"
              onClick={handleReset}
              size="sm"
              style={{
                width: "auto",
                height: 36,
                lineHeight: "36px",
                padding: "0 12px",
              }}
            >
              Tải lại
            </Button>
            <Button
              variant="filled"
              color="blue"
              onClick={handleSearch}
              size="sm"
              style={{
                width: "auto",
                height: 36,
                lineHeight: "36px",
                padding: "0 12px",
              }}
            >
              Tìm kiếm
            </Button>
          </Flex>

          <div
            style={{
              maxHeight: 400,
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

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
                  <th style={{ textAlign: "left", padding: "8px" }}>
                    Họ và tên
                  </th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>
                    Mã nhân viên
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStaffs.map((staff) => {
                  const isSelected = selectedStaffs.some(
                    (s) => s.staffId === staff.id
                  );

                  return (
                    <tr
                      key={staff.id}
                      onClick={() => toggleSelection(staff.id)}
                      style={{
                        backgroundColor: isSelected ? "#e6f7ff" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        <Checkbox
                          checked={isSelected}
                          disabled
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {[staff.firstName, staff.middleName, staff.lastName]
                          .filter(Boolean)
                          .join(" ")}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {staff.email}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          width: 120,
                        }}
                      >
                        {staff.staffCode}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </Modal>
  );
};

export default AssignStaffModal;
