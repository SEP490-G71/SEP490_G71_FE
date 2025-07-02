import { Button, Grid, Group, Modal, TextInput } from "@mantine/core";
import { useState, useMemo } from "react";
import { Patient } from "../../../types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";
import CustomTable from "../../../components/common/CustomTable";
import { Column } from "../../../types/table";

interface SearchPatientModalProps {
  opened: boolean;
  onClose: () => void;
  patients: Patient[];
  selected: Patient | null;
  onSelect: (patient: Patient | null) => void;
  onConfirm: () => void;
}

export default function SearchPatientModal({
  opened,
  onClose,
  patients,
  selected,
  onSelect,
  onConfirm,
}: SearchPatientModalProps) {
  // Bộ lọc thực thi khi nhấn Enter
  const [filters, setFilters] = useState({
    maBN: "",
    name: "",
    phone: "",
  });

  // Trạng thái nhập liệu (chỉ áp dụng khi nhấn Enter)
  const [inputFilters, setInputFilters] = useState({
    maBN: "",
    name: "",
    phone: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Xử lý Enter để cập nhật bộ lọc thực thi
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters(inputFilters);
      setPage(1); // reset trang về 1 khi lọc
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const fullName = `${p.firstName ?? ""} ${p.middleName ?? ""} ${
        p.lastName ?? ""
      }`.toLowerCase();
      return (
        (!filters.maBN ||
          p.patientCode?.toLowerCase().includes(filters.maBN.toLowerCase())) &&
        (!filters.name || fullName.includes(filters.name.toLowerCase())) &&
        (!filters.phone || p.phone?.includes(filters.phone))
      );
    });
  }, [patients, filters]);

  const paginatedPatients = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, page, pageSize]);

  const columns: Column<Patient>[] = [
    {
      key: "id",
      label: "",
      render: (patient) => (
        <input
          type="radio"
          name="selectPatient"
          checked={selected?.id === patient.id}
          onChange={() => onSelect(patient)}
        />
      ),
    },
    { key: "patientCode", label: "Mã BN" },
    {
      key: "fullName",
      label: "Họ tên",
      render: (patient) =>
        `${patient.firstName ?? ""} ${patient.middleName ?? ""} ${
          patient.lastName ?? ""
        }`.trim(),
    },
    { key: "phone", label: "Điện thoại" },
    {
      key: "dob",
      label: "Ngày sinh",
      render: (patient) =>
        new Date(patient.dob || "").toString() === "Invalid Date"
          ? "-"
          : new Date(patient.dob).toLocaleDateString("vi-VN"),
    },
    { key: "gender", label: "Giới tính" },
    {
      key: "email",
      label: "Email",
      render: (patient) => patient.email || "-",
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Danh sách bệnh nhân"
      size="80%"
      radius="md"
      padding="md"
      centered
    >
      <div className="space-y-4">
        <Grid gutter="xs">
          <Grid.Col span={4}>
            <TextInput
              label="Mã BN"
              placeholder="Nhập mã"
              value={inputFilters.maBN}
              onChange={(e) =>
                setInputFilters((prev) => ({ ...prev, maBN: e.target.value }))
              }
              onKeyDown={handleKeyDown}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Họ tên"
              placeholder="Nhập họ tên"
              value={inputFilters.name}
              onChange={(e) =>
                setInputFilters((prev) => ({ ...prev, name: e.target.value }))
              }
              onKeyDown={handleKeyDown}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Điện thoại"
              placeholder="Nhập SĐT"
              value={inputFilters.phone}
              onChange={(e) =>
                setInputFilters((prev) => ({ ...prev, phone: e.target.value }))
              }
              onKeyDown={handleKeyDown}
            />
          </Grid.Col>
        </Grid>

        <CustomTable
          data={paginatedPatients}
          columns={columns}
          page={page}
          pageSize={pageSize}
          totalItems={filteredPatients.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          showActions={false}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Hủy
          </Button>
          <Button color="blue" disabled={!selected} onClick={onConfirm}>
            Xác nhận
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
