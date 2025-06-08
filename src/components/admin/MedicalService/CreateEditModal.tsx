import { Modal, TextInput, NumberInput, Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import {
  CreateMedicalServiceRequest,
  Department,
  MedicalService,
} from "../../../types/MedicalService";
import axiosInstance from "../../../services/axiosInstance";

interface CreateEditModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: MedicalService | null;
  onSubmit: (formData: CreateMedicalServiceRequest) => void;
  isViewMode?: boolean;
}

const CreateEditModal: React.FC<CreateEditModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  //Bắn log để debug
  // if (initialData) {
  //   console.log("initialData", initialData);
  // }

  const getAllDepartments = async () => {
    try {
      const res = await axiosInstance.get("departments/all");
      setDepartments(res.data.result);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      return null;
    }
  };

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      departmentId: "",
      price: 0,
      vat: 0,
    } as CreateMedicalServiceRequest,

    validate: {
      /*************  ✨ Windsurf Command ⭐  *************/
      /*******  d73cc53d-623a-4af9-8229-d0c61183ea2b  *******/
      name: (value) =>
        value.length < 3 || value.length > 100
          ? "Name must be between 3 and 100 characters"
          : null,
      description: (value) =>
        value.length > 500
          ? "Description must be at most 500 characters"
          : null,
      departmentId: (value) => (!value ? "Department is required" : null),
      price: (value) => (value < 0 ? "Price must be >= 0" : null),
      vat: (value) =>
        ![0, 8, 10].includes(value) ? "VAT must be one of 0, 8, or 10" : null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        departmentId: initialData?.department.id ?? "",
        price: initialData.price ?? 0,
        vat: initialData.vat ?? 0,
      });
    } else {
      form.reset();
    }
    getAllDepartments();
  }, [initialData, opened]);

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <h2 className="text-xl font-bold">
            {initialData ? "Cập nhật dịch vụ khám" : "Tạo dịch vụ khám"}
          </h2>
          <div className="mt-2 border-b border-gray-300"></div>
        </div>
      }
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Tên dịch vụ"
          placeholder="Tên dịch vụ"
          {...form.getInputProps("name")}
          required
          disabled={isViewMode}
        />

        <TextInput
          label="Mô tả"
          placeholder="Mô tả"
          {...form.getInputProps("description")}
          mt="sm"
          disabled={isViewMode}
        />

        <Select
          label="Phòng ban"
          placeholder="Phòng ban"
          {...form.getInputProps("departmentName")}
          data={departments.map((department) => ({
            value: department.id,
            label: department.name,
          }))}
          value={form.values.departmentId}
          onChange={(value) => {
            if (value !== null) {
              form.setFieldValue("departmentId", value);
            }
          }}
          required
          mt="sm"
          disabled={isViewMode}
        />

        <NumberInput
          label="Giá tiền"
          placeholder="Giá tiền"
          {...form.getInputProps("price")}
          required
          mt="sm"
          min={0}
          disabled={isViewMode}
        />

        <Select
          label="VAT (%)"
          placeholder="Chọn VAT"
          data={[
            { value: "0", label: "0%" },
            { value: "8", label: "8%" },
            { value: "10", label: "10%" },
          ]}
          {...form.getInputProps("vat")}
          required
          mt="sm"
          onChange={(value) => {
            if (value !== null) {
              form.setFieldValue("vat", parseInt(value));
            }
          }}
          value={form.values.vat.toString()}
          disabled={isViewMode}
        />
        {!isViewMode && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button type="submit">{initialData ? "Cập nhật" : "Tạo"}</Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default CreateEditModal;
