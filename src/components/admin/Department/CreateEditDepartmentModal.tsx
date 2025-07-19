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
import AssignStaffModal from "../Department-Staffs/AssignStaffModal";
import { DepartmentStaffResponse } from "../../../types/Admin/Department-Staffs/DepartmentStaffResponse ";
import useRemoveStaffFromDepartment from "../../../hooks/department-Staffs/useRemoveStaffFromDepartment";
import { IconSquareX } from "@tabler/icons-react";
import {
  validateName,
  validateRoomNumber,
  validateDescription,
} from "../../utils/validation";
import { DepartmentRequest } from "../../../types/Admin/Department/DepartmentTypeRequest";
interface CreateEditDepartmentModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: DepartmentResponse | null;
  onSubmit: (data: Partial<DepartmentRequest>) => void;
  isViewMode?: boolean;
}

const CreateEditDepartmentModal: React.FC<CreateEditDepartmentModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const [departmentData, setDepartmentData] =
    useState<DepartmentStaffResponse | null>(null);

  const [loadingStaffs, setLoadingStaffs] = useState(false);
  const [assignModalOpened, setAssignModalOpened] = useState(false);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<string | null>(null);

  const [specializations, setSpecializations] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await axiosInstance.get("/specializations/all");
        setSpecializations(res.data.result || []);
      } catch (error) {
        toast.error("Không thể tải danh sách chuyên khoa.");
      }
    };

    fetchSpecializations();
  }, []);
  const { removeStaff, loading: removingStaff } =
    useRemoveStaffFromDepartment();

  const form = useForm<Partial<DepartmentRequest>>({
    initialValues: {
      name: "",
      description: "",
      roomNumber: "",
      type: DepartmentType.CONSULTATION,
      specializationId: initialData?.specialization?.id || "",
    },
    validate: {
      name: (value) => validateName(value ?? ""),
      description: (value) => validateDescription(value ?? ""),
      roomNumber: (value) => validateRoomNumber(value ?? ""),
      type: (value) => (!value ? "Loại phòng không được để trống" : null),
    },
  });

  const fetchStaffs = async () => {
    if (!initialData?.id) return;
    setLoadingStaffs(true);
    try {
      const res = await axiosInstance.get(`/departments/${initialData.id}`);
      setDepartmentData(res.data.result ?? null);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error);
      toast.error("Không thể tải danh sách nhân viên.");
    } finally {
      setLoadingStaffs(false);
    }
  };

  useEffect(() => {
    if (initialData && specializations.length > 0) {
      form.setValues({
        name: initialData.name || "",
        description: initialData.description || "",
        roomNumber: initialData.roomNumber || "",
        type: initialData.type || DepartmentType.CONSULTATION,
        specializationId: initialData.specialization?.id ?? "",
      });
    }
  }, [initialData, specializations]);

  useEffect(() => {
    if (!initialData) {
      form.reset();
      setDepartmentData(null);
    }
  }, [initialData, opened]);

  useEffect(() => {
    if (opened && initialData?.id) {
      fetchStaffs();
    }
  }, [opened, initialData]);
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
        size="lg"
        radius="md"
        yOffset={90}
        title={
          <div>
            <h2 className="text-xl font-bold">
              {isViewMode
                ? "Xem Permission"
                : initialData
                ? "Cập nhật phòng ban"
                : "Tạo phòng ban mới"}
            </h2>
            <div className="mt-2 border-b border-gray-300"></div>
          </div>
        }
        styles={{
          title: {
            fontWeight: 600,
            width: "100%",
          },
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const validation = await form.validate();

            if (validation.hasErrors) {
              toast.error("Vui lòng điền đầy đủ thông tin hợp lệ.");
              return;
            }

            try {
              await onSubmit(form.values as DepartmentRequest);

              onClose();
            } catch (error) {
              console.error("Lỗi khi lưu phòng ban", error);
              toast.error("Lỗi khi lưu phòng ban");
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
            value={form.values.type ?? null}
            onChange={(val) => {
              form.setFieldValue("type", val as DepartmentType | undefined);
            }}
            error={form.errors.type}
            mt="sm"
            required
            clearable
            disabled={isViewMode}
          />
          <Select
            label="Chuyên khoa"
            placeholder="Chọn chuyên khoa"
            data={specializations.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
            value={form.values.specializationId ?? ""}
            onChange={(val) =>
              form.setFieldValue("specializationId", val ?? "")
            }
            mt="sm"
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
              ) : (departmentData?.staffs.length ?? 0) === 0 ? (
                <Text color="dimmed" size="sm" className="text-center">
                  Không có nhân viên nào trong phòng này.
                </Text>
              ) : (
                <div style={{ width: "100%" }}>
                  <Table
                    highlightOnHover
                    verticalSpacing={2}
                    style={{ width: "100%" }}
                  >
                    <thead style={{ backgroundColor: "#f1f1f1" }}>
                      <tr>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "4px 8px",
                            paddingLeft: "40px",
                          }}
                        >
                          Họ tên
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "4px 8px",
                            paddingLeft: "48px",
                          }}
                        >
                          Mã nhân viên
                        </th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData?.staffs.map((staff) => (
                        <tr
                          key={staff.id}
                          style={{
                            borderBottom: "1px solid #dee2e6",
                          }}
                        >
                          <td
                            style={{
                              textAlign: "left",
                              padding: "4px 8px",
                              paddingLeft: "40px",
                            }}
                          >
                            {staff.fullName}
                          </td>
                          <td
                            style={{
                              textAlign: "left",
                              padding: "4px 8px",
                              paddingLeft: "48px",
                            }}
                          >
                            {staff.staffCode}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "4px 8px",
                            }}
                          >
                            <Button
                              size="sm"
                              variant="subtle"
                              color="red"
                              px={0}
                              style={{ height: "auto" }}
                              onClick={() => handleRemoveStaff(staff.id)}
                            >
                              <IconSquareX size={24} />
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
