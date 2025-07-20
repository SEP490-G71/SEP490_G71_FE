import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { Patient } from "../../../types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";
import CustomTable from "../../../components/common/CustomTable";
import { Column } from "../../../types/table";
import { FloatingLabelWrapper } from "../../common/FloatingLabelWrapper";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";

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
  const [filters, setFilters] = useState({
    maBN: "",
    name: "",
    phone: "",
  });

  const [inputFilters, setInputFilters] = useState({
    maBN: "",
    name: "",
    phone: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { setting } = useSettingAdminService();
  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]); // Lấy phần tử đầu tiên
    }
  }, [setting]);

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
        <div className="grid grid-cols-12 gap-4 mb-4 items-end">
          <div className="col-span-12 md:col-span-3">
            <FloatingLabelWrapper label="Mã BN">
              <TextInput
                placeholder="Nhập mã"
                value={inputFilters.maBN}
                onChange={(e) =>
                  setInputFilters((prev) => ({ ...prev, maBN: e.target.value }))
                }
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-12 md:col-span-3">
            <FloatingLabelWrapper label="Họ tên bệnh nhân">
              <TextInput
                placeholder="Nhập họ tên"
                value={inputFilters.name}
                onChange={(e) =>
                  setInputFilters((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-12 md:col-span-3">
            <FloatingLabelWrapper label="Số điện thoại">
              <TextInput
                placeholder="Nhập SĐT"
                value={inputFilters.phone}
                onChange={(e) =>
                  setInputFilters((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-12 md:col-span-3 flex items-end gap-2">
            <Button
              variant="light"
              color="gray"
              onClick={() => {
                setInputFilters({ maBN: "", name: "", phone: "" });
                setFilters({ maBN: "", name: "", phone: "" });
                setPage(1);
              }}
              className="w-full"
              fullWidth
            >
              Tải lại
            </Button>
            <Button
              variant="filled"
              color="blue"
              onClick={() => {
                setFilters(inputFilters);
                setPage(1);
              }}
              className="w-full"
              fullWidth
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

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
          pageSizeOptions={setting?.paginationSizeList
            .slice()
            .sort((a, b) => a - b)}
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
