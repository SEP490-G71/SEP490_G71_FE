import {
  Modal,
  TextInput,
  Button,
  Select,
  Table,
  Text,
  Loader,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";
import { DepartmentResponse } from "../../../types/Admin/Department/DepartmentTypeResponse";
import { IconPlus } from "@tabler/icons-react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { Position } from "../../../enums/Admin/Position";
import AssignStaffModal from "../Department-Staffs/AssignStaffModal";
import { DepartmentStaffResponse } from "../../../types/Admin/Department-Staffs/DepartmentStaffResponse ";
import useRemoveStaffFromDepartment from "../../../hooks/department-Staffs/useRemoveStaffFromDepartment";

interface CreateEditDepartmentModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: DepartmentResponse | null;
  onSubmit: (data: Partial<DepartmentResponse>) => void;
  isViewMode?: boolean;
}

const CreateEditDepartmentModal: React.FC<CreateEditDepartmentModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const [departmentStaffs, setDepartmentStaffs] = useState<
    DepartmentStaffResponse[]
  >([]);
  const [loadingStaffs, setLoadingStaffs] = useState(false);
  const [assignModalOpened, setAssignModalOpened] = useState(false);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<string | null>(null);

  const { removeStaff, loading: removingStaff } =
    useRemoveStaffFromDepartment();

  const form = useForm<Partial<DepartmentResponse>>({
    initialValues: {
      name: "",
      description: "",
      roomNumber: "",
      type: DepartmentType.CONSULTATION,
    },
    validate: {
      name: (value) =>
        !value || value.trim() === ""
          ? "Tên phòng không được bỏ trống"
          : value.length < 3 || value.length > 100
          ? "Tên phòng phải từ 3 đến 100 ký tự"
          : null,
      description: (value) =>
        value && (value.length < 3 || value.length > 500)
          ? "Mô tả phải từ 3 đến 500 ký tự"
          : null,
      roomNumber: (value) =>
        !value || value.trim() === ""
          ? "Số phòng không được bỏ trống"
          : !/^[A-Za-z0-9]{2,5}$/.test(value)
          ? "Số phòng phải từ 2-5 ký tự, không dấu và không khoảng trắng"
          : null,
      type: (value) => (!value ? "Loại phòng không được để trống" : null),
    },
  });

  const fetchStaffs = async () => {
    if (!initialData?.id) return;
    setLoadingStaffs(true);
    try {
      const res = await axiosInstance.get(
        `/department-staffs/department/${initialData.id}/staffs`
      );
      setDepartmentStaffs(res.data.result || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error);
      toast.error("Không thể tải danh sách nhân viên.");
    } finally {
      setLoadingStaffs(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name || "",
        description: initialData.description || "",
        roomNumber: initialData.roomNumber || "",
        type: initialData.type || DepartmentType.CONSULTATION,
      });
    } else {
      form.reset();
      setDepartmentStaffs([]);
    }
  }, [initialData, opened]);

  useEffect(() => {
    if (initialData?.id) {
      fetchStaffs();
    }
  }, [initialData?.id]);

  const handleRemoveStaff = (staffId: string) => {
    setStaffToRemove(staffId);
    setConfirmDeleteModal(true);
  };

  const confirmRemove = async () => {
    if (!initialData?.id || !staffToRemove) return;

    const result = await removeStaff({
      departmentId: initialData.id,
      staffIdToRemove: staffToRemove,
    });

    if (result) {
      fetchStaffs();
    }

    setConfirmDeleteModal(false);
    setStaffToRemove(null);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={initialData ? "Cập nhật phòng ban" : "Tạo mới phòng ban"}
        size="lg"
        radius="md"
        yOffset={90}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const validation = form.validate();
            if (!validation.hasErrors) {
              onSubmit(form.values);
              onClose();
            }
          }}
        >
          <TextInput
            label="Tên phòng ban"
            placeholder="Nhập tên"
            {...form.getInputProps("name")}
            error={form.errors.name}
            required
            disabled={isViewMode}
          />

          <TextInput
            label="Mô tả"
            placeholder="Nhập mô tả"
            {...form.getInputProps("description")}
            error={form.errors.description}
            mt="sm"
            disabled={isViewMode}
          />

          <TextInput
            label="Số phòng"
            placeholder="Nhập số phòng"
            {...form.getInputProps("roomNumber")}
            error={form.errors.roomNumber}
            mt="sm"
            required
            disabled={isViewMode}
          />

          <Select
            label="Loại phòng"
            placeholder="Chọn loại"
            data={Object.entries(DepartmentType).map(([value, label]) => ({
              value,
              label,
            }))}
            value={form.values.type || ""}
            onChange={(val) => {
              if (val) form.setFieldValue("type", val as DepartmentType);
            }}
            error={form.errors.type}
            mt="sm"
            required
            disabled={isViewMode}
          />

          {initialData && (
            <div className="mt-6">
              <Flex justify="space-between" align="center" mb="sm">
                <Text fw={600} size="sm">
                  Danh sách nhân viên trong phòng
                </Text>

                <Button
                  leftSection={<IconPlus size={16} />}
                  variant="filled"
                  size="xs"
                  onClick={() => setAssignModalOpened(true)}
                >
                  Thêm nhân viên
                </Button>
              </Flex>

              {loadingStaffs ? (
                <div className="flex justify-center py-6">
                  <Loader />
                </div>
              ) : departmentStaffs.length === 0 ? (
                <Text color="dimmed" size="sm" className="text-center">
                  Không có nhân viên nào trong phòng này.
                </Text>
              ) : (
                <div style={{ padding: "0 24px" }}>
                  <Table
                    highlightOnHover
                    verticalSpacing="sm"
                    style={{
                      borderSpacing: "0 12px",
                      borderCollapse: "separate",
                      fontSize: "14px",
                      width: "100%",
                    }}
                  >
                    <thead style={{ backgroundColor: "#f1f1f1" }}>
                      <tr>
                        <th style={{ textAlign: "left" }}>Họ tên</th>
                        <th style={{ textAlign: "left" }}>Chức vụ</th>
                        <th style={{ textAlign: "left" }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(
                        departmentStaffs.reduce((acc, curr) => {
                          if (!acc[curr.staffId]) {
                            acc[curr.staffId] = {
                              staffId: curr.staffId,
                              staffName: curr.staffName,
                              positions: [Position[curr.position]],
                            };
                          } else {
                            acc[curr.staffId].positions.push(
                              Position[curr.position]
                            );
                          }
                          return acc;
                        }, {} as Record<string, { staffId: string; staffName: string; positions: string[] }>)
                      ).map((staff) => (
                        <tr key={staff.staffId}>
                          <td style={{ textAlign: "left" }}>
                            {staff.staffName}
                          </td>
                          <td style={{ textAlign: "left" }}>
                            {staff.positions.join(", ")}
                          </td>
                          <td style={{ textAlign: "left" }}>
                            <Button
                              variant="outline"
                              color="red"
                              size="xs"
                              onClick={() => handleRemoveStaff(staff.staffId)}
                            >
                              ×
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {!isViewMode && (
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" color="blue" onClick={onClose}>
                Huỷ
              </Button>
              <Button type="submit">
                {initialData ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          )}
        </form>
      </Modal>

      <AssignStaffModal
        opened={assignModalOpened}
        onClose={() => setAssignModalOpened(false)}
        departmentId={initialData?.id || ""}
        onAssigned={fetchStaffs}
      />

      <Modal
        opened={confirmDeleteModal}
        onClose={() => {
          setConfirmDeleteModal(false);
          setStaffToRemove(null);
        }}
        title="Xác nhận xoá nhân viên"
        centered
        radius="md"
        size="sm"
      >
        <Text>Bạn có chắc chắn muốn xoá nhân viên này khỏi phòng ban?</Text>
        <Flex justify="flex-end" gap="sm" mt="md">
          <Button
            variant="outline"
            onClick={() => setConfirmDeleteModal(false)}
          >
            Huỷ
          </Button>
          <Button color="red" onClick={confirmRemove} loading={removingStaff}>
            Xoá
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default CreateEditDepartmentModal;
