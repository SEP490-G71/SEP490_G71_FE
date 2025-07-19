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
  validateName,
  validateRoomNumber,
  validateDescription,
} from "../../utils/validation";
import { DepartmentRequest } from "../../../types/Admin/Department/DepartmentTypeRequest";
import StaffListTable from "./StaffListTable";
import DepartmentFormFields from "./DepartmentFormFields";
import useDepartmentStaffs from "../../../hooks/department-Staffs/useDepartmentStaffs";

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
  const [assignModalOpened, setAssignModalOpened] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<string | null>(null);

  const [specializations, setSpecializations] = useState<
    { id: string; name: string }[]
  >([]);

  const { removeStaff, loading: removingStaff } =
    useRemoveStaffFromDepartment();

  const {
    data: departmentData,
    loading: loadingStaffs,
    refetch: refetchDepartmentStaffs,
  } = useDepartmentStaffs(initialData?.id);

  const form = useForm<Partial<DepartmentRequest>>({
    initialValues: {
      name: "",
      description: "",
      roomNumber: "",
      type: DepartmentType.CONSULTATION,
      specializationId: "",
    },
    validate: {
      name: (value) => validateName(value ?? ""),
      description: (value) => validateDescription(value ?? ""),
      roomNumber: (value) => validateRoomNumber(value ?? ""),
      type: (value) => (!value ? "Loại phòng không được để trống" : null),
    },
  });

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
    }
  }, [initialData, opened]);

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
          <DepartmentFormFields
            form={form}
            specializations={specializations}
            isViewMode={isViewMode}
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

              {!loadingStaffs && departmentData?.staffs && (
                <StaffListTable
                  staffs={departmentData.staffs}
                  onRemove={handleRemoveStaff}
                />
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
        onAssigned={refetchDepartmentStaffs}
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
