import { Modal, TextInput, Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import {
  CreateMedicalServiceRequest,
  MedicalService,
} from "../../../types/Admin/MedicalService/MedicalService";
import useDepartmentService from "../../../hooks/department-service/useDepartmentService";

interface CreateEditModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: MedicalService | null;
  onSubmit: (formData: CreateMedicalServiceRequest) => Promise<boolean>;
  isViewMode?: boolean;
}

const CreateEditModal: React.FC<CreateEditModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const {
    departments,
    fetchAllDepartments,
    loading: loadingDepts,
  } = useDepartmentService();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      departmentId: "",
      price: 0,
      vat: 0,
    } as CreateMedicalServiceRequest,

    validate: {
      name: (value) =>
        value.length < 3 || value.length > 100
          ? "Tên phải nằm trong khoảng từ 3 đến 100 ký tự"
          : null,
      description: (value) =>
        value.length > 500 ? "Mô tả có tối đa 500 ký tự" : null,
      departmentId: (value) => (!value ? "Phòng ban là bắt buộc" : null),
      price: (value) => {
        if (value === null || value === undefined)
          return "Giá tiền là bắt buộc";
        if (typeof value !== "number" || Number.isNaN(value))
          return "Giá tiền phải là một số";
        if (value < 0) return "Giá tiền phải >= 0";
        return null;
      },
      vat: (value) =>
        ![0, 8, 10].includes(value)
          ? "VAT phải là một trong 0, 8 hoặc 10"
          : null,
    },
  });

  const [priceInput, setPriceInput] = useState<string>("");

  const formatVN = (n: number) =>
    Number.isFinite(n) ? n.toLocaleString("vi-VN") : "";

  const handlePriceChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const num = digits ? parseInt(digits, 10) : 0;
    form.setFieldValue("price", num);
    setPriceInput(digits ? formatVN(num) : "");
  };

  useEffect(() => {
    if (opened && departments.length === 0) {
      fetchAllDepartments();
    }

    if (initialData) {
      form.setValues({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        departmentId: initialData?.department?.id ?? "",
        price: initialData.price ?? 0,
        vat: initialData.vat ?? 0,
      });
      setPriceInput(
        initialData.price != null ? formatVN(initialData.price) : ""
      );
    } else {
      form.reset();
      setPriceInput("");
    }
  }, [initialData, opened]);

  const handleSubmit = async (values: typeof form.values) => {
    const ok = await onSubmit(values);
    if (ok) onClose();
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
      closeOnClickOutside={false}
      closeOnEscape={false}
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
          data={departments.map((d) => ({ value: d.id, label: d.name }))}
          {...form.getInputProps("departmentId")}
          required
          mt="sm"
          disabled={isViewMode || loadingDepts}
          rightSection={loadingDepts ? <span className="mr-2">⏳</span> : null}
          searchable
          clearable={false}
        />

        <TextInput
          label="Giá tiền"
          placeholder="VD: 100.000"
          value={priceInput}
          onChange={(e) => handlePriceChange(e.currentTarget.value)}
          onBlur={(e) => handlePriceChange(e.currentTarget.value)}
          required
          mt="sm"
          disabled={isViewMode}
          inputMode="numeric"
        />

        <Select
          label="VAT (%)"
          placeholder="Chọn VAT"
          data={[
            { value: "0", label: "0%" },
            { value: "8", label: "8%" },
            { value: "10", label: "10%" },
          ]}
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
