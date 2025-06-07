import { Modal, TextInput, NumberInput, Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { Department, MedicalService } from "../../../types/MedicalService";
import axiosInstance from "../../../services/axiosInstance";

interface CreateEditModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: MedicalService | null;
  onSubmit: (data: {
    name: string;
    description: string;
    departmentName: string;
    price: number;
    vat: number;
  }) => void;
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

  console.log("initialData", initialData);

  const getAllDepartments = async () => {
    try {
      const res = await axiosInstance.get("departments/all");
      setDepartments(res.data.result);
    } catch (error) {
      console.error("Failed to fetch medical service by id:", error);
      return null;
    }
  };

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      departmentName: "",
      price: 0,
      vat: 0,
    },

    validate: {
      name: (value) =>
        value.length < 3 || value.length > 100
          ? "Name must be between 3 and 100 characters"
          : null,
      description: (value) =>
        value.length > 500
          ? "Description must be at most 500 characters"
          : null,
      departmentName: (value) => (!value ? "Department is required" : null),
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
        departmentName: initialData?.department.name ?? "",
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
      title={initialData ? "Update Medical Service" : "Create Medical Service"}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Enter name"
          {...form.getInputProps("name")}
          required
          disabled={isViewMode}
        />

        <TextInput
          label="Description"
          placeholder="Enter description"
          {...form.getInputProps("description")}
          mt="sm"
          disabled={isViewMode}
        />

        <Select
          label="Department"
          placeholder="Please select department"
          {...form.getInputProps("departmentName")}
          data={departments.map((department) => ({
            value: department.name,
            label: department.name,
          }))}
          value={form.values.departmentName}
          onChange={(value) => {
            if (value !== null) {
              form.setFieldValue("departmentName", value);
            }
          }}
          required
          mt="sm"
          disabled={isViewMode}
        />

        <NumberInput
          label="Price"
          placeholder="Enter price"
          {...form.getInputProps("price")}
          required
          mt="sm"
          min={0}
          step={0.001}
          disabled={isViewMode}
        />

        <Select
          label="VAT (%)"
          placeholder="Select VAT"
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
          <Button type="submit" fullWidth mt="md">
            {initialData ? "Update" : "Create"}
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default CreateEditModal;
