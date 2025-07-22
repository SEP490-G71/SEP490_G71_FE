import { Modal, Button, Text, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";
import { DepartmentResponse } from "../../../types/Admin/Department/DepartmentTypeResponse";
import { IconPlus } from "@tabler/icons-react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import AssignStaffModal from "../Department-Staffs/AssignStaffModal";
import useRemoveStaffFromDepartment from "../../../hooks/department-Staffs/useRemoveStaffFromDepartment";
import {
  validateRoomNumber,
  validateDescription,
  validateNameForDepartmen,
} from "../../utils/validation";
import { DepartmentRequest } from "../../../types/Admin/Department/DepartmentTypeRequest";
import StaffListTable from "./StaffListTable";
import DepartmentFormFields from "./DepartmentFormFields";
import useDepartmentStaffs from "../../../hooks/department-Staffs/useDepartmentStaffs";
import useDepartmentService from "../../../hooks/department-service/useDepartmentService";

interface CreateEditDepartmentModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: DepartmentResponse | null;
  isViewMode?: boolean;
  onSubmit?: () => void;
}

const CreateEditDepartmentModal: React.FC<CreateEditDepartmentModalProps> = ({
  opened,
  onClose,
  initialData,
  isViewMode = false,
  onSubmit,
}) => {
  const [assignModalOpened, setAssignModalOpened] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<
    { id: string; name: string }[]
  >([]);

  const { createDepartment, updateDepartment } = useDepartmentService();
  const { removeStaff, loading: removingStaff } =
    useRemoveStaffFromDepartment();

  const {
    data: departmentData,
    loading: loadingStaffs,
    refetch: refetchDepartmentStaffs,
  } = useDepartmentStaffs(initialData?.id);

  const form = useForm<DepartmentRequest>({
    initialValues: {
      name: "",
      description: "",
      roomNumber: "",
      type: undefined as unknown as DepartmentType,
      specializationId: "",
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
    validate: {
      name: (value) => validateNameForDepartmen(value ?? ""),
      description: (value) => validateDescription(value ?? ""),
      roomNumber: (value) => validateRoomNumber(value ?? ""),
      type: (value) => (!value ? "Loại phòng không được để trống" : null),
      specializationId: () => null,
    },
  });
  useEffect(() => {
    const fetchAndSet = async () => {
      try {
        const res = await axiosInstance.get("/specializations/all");
        const specs = res.data.result || [];
        setSpecializations(specs);

        if (initialData) {
          form.setValues({
            name: initialData.name || "",
            description: initialData.description || "",
            roomNumber: initialData.roomNumber || "",
            type: initialData.type as DepartmentType,
            specializationId: initialData.specialization?.id || "",
          });
        } else {
          form.setValues({
            name: "",
            description: "",
            roomNumber: "",
            type: "" as any,
            specializationId: "",
          });
        }

        form.resetDirty();
      } catch (error) {
        toast.error("Không thể tải danh sách chuyên khoa.");
      }
    };

    if (opened) {
      fetchAndSet();
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
      refetchDepartmentStaffs();
    }

    setConfirmDeleteModal(false);
    setStaffToRemove(null);
  };

  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewMode) {
      return;
    }

    const { hasErrors } = form.validate();
    if (hasErrors) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ.");
      return;
    }

    try {
      let result: DepartmentResponse | null = null;

      if (initialData) {
        result = await updateDepartment(initialData.id, form.values);
      } else {
        result = await createDepartment(form.values);
      }

      if (result) {
        if (onSubmit) await onSubmit();
        handleModalClose();
      }
    } catch (err: any) {
      const resultErrors = err?.response?.data?.result;
      const message = err?.response?.data?.message?.toLowerCase?.() ?? "";
      const messageMap: Record<string, string> = {
        name: "Tên phòng ban không hợp lệ",
        description: "Mô tả không hợp lệ",
        roomNumber: "Số phòng không hợp lệ",
        type: "Loại phòng không hợp lệ",
        specializationId: "Chuyên khoa không hợp lệ",
      };

      if (Array.isArray(resultErrors)) {
        resultErrors.forEach((e: { field: string; message: string }) => {
          const field = e.field as keyof DepartmentRequest;
          const translated = messageMap[field] || e.message;
          form.setFieldError(field, translated);
        });
        return;
      }

      if (message.includes("room number already exists")) {
        form.setErrors({ roomNumber: "Số phòng này đã tồn tại" });
        form.setFieldValue("roomNumber", form.values.roomNumber + " ");
        setTimeout(() => {
          form.setFieldValue("roomNumber", form.values.roomNumber.trim());
        }, 50);
        return;
      }

      toast.error("❗ " + (message || "Đã xảy ra lỗi không xác định"));
      console.error("Submit error in modal", err);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleModalClose}
        size="lg"
        radius="md"
        yOffset={90}
        title={
          <div>
            <h2 className="text-xl font-bold">
              {isViewMode
                ? "Xem thông tin phòng ban"
                : initialData
                ? "Cập nhật phòng ban"
                : "Tạo mới phòng ban"}
            </h2>
            <div className="mt-2 border-b border-gray-300" />
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <DepartmentFormFields
            form={form}
            specializations={specializations}
            isViewMode={isViewMode}
          />

          {initialData && (
            <div className="mt-6">
              <Flex justify="space-between" align="center" mb="sm">
                <Text fw={600} size="sm">
                  Danh sách nhân viên
                </Text>

                {!isViewMode && (
                  <Button
                    leftSection={<IconPlus size={16} />}
                    variant="filled"
                    size="xs"
                    onClick={() => setAssignModalOpened(true)}
                  >
                    Thêm nhân viên
                  </Button>
                )}
              </Flex>

              {!loadingStaffs && departmentData?.staffs && (
                <StaffListTable
                  staffs={departmentData.staffs}
                  onRemove={handleRemoveStaff}
                  isViewMode={isViewMode}
                />
              )}
            </div>
          )}

          {!isViewMode && (
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={handleModalClose}>
                Huỷ
              </Button>
              <Button type="submit">
                {initialData ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          )}
        </form>
      </Modal>

      {initialData && (
        <AssignStaffModal
          opened={assignModalOpened}
          onClose={() => setAssignModalOpened(false)}
          departmentId={initialData.id}
          onAssigned={refetchDepartmentStaffs}
        />
      )}

      <Modal
        opened={confirmDeleteModal}
        onClose={() => {
          setConfirmDeleteModal(false);
          setStaffToRemove(null);
        }}
        title="Xác nhận xóa nhân viên"
        centered
        radius="md"
        size="sm"
      >
        <Text>
          Bạn có chắc chắn muốn xóa nhân viên này khỏi phòng ban không?
        </Text>
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
