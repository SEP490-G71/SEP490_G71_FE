import { Button, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { CreatePatientModal } from "../../../components/admin/Patient-Management/CreatePatientModal";
import { createColumn } from "../../../components/utils/tableUtils";
import {
  Patient,
  CreateUpdatePatientRequest,
} from "../../../types/Admin/Patient-Management/PatientManagement";
import { usePatientManagement } from "../../../hooks/Patient-Management/usePatientManagement";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { normalizePatient } from "../../../types/Admin/Patient-Management/patientUtils";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

export const PatientManagementPage = () => {
  const {
    patients,
    loading,
    fetchAllPatients,
    fetchPatientById,
    deletePatientById,
  } = usePatientManagement();

  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  // Tách input và search state
  const [searchFullName, setSearchFullName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchPatientCode, setSearchPatientCode] = useState("");
  const [searchPatientCodeInput, setSearchPatientCodeInput] = useState("");
  const [searchFullNameInput, setSearchFullNameInput] = useState("");
  const [searchPhoneInput, setSearchPhoneInput] = useState("");

  const { setting } = useSettingAdminService();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchAllPatients(page - 1, pageSize, {
      name: searchFullName || undefined,
      phone: searchPhone || undefined,
      patientCode: searchPatientCode || undefined,
    }).then((total) => {
      setTotalItems(total);
    });
  }, [page, pageSize, searchFullName, searchPhone, searchPatientCode]);

  const handleSearch = () => {
    setSearchPatientCode(searchPatientCodeInput.trim());
    setSearchFullName(searchFullNameInput.trim());
    setSearchPhone(searchPhoneInput.trim());
    setPage(1);
  };

  const handleReset = () => {
    setSearchPatientCodeInput("");
    setSearchFullNameInput("");
    setSearchPhoneInput("");
    setSearchPatientCode("");
    setSearchFullName("");
    setSearchPhone("");
    setPage(1);
  };

  const handleAdd = () => {
    setSelectedPatient(null);
    setModalOpened(true);
  };

  const handleView = async (row: Patient) => {
    const rawPatient = await fetchPatientById(row.id);
    if (rawPatient) {
      setSelectedPatient(normalizePatient(rawPatient));
      setIsViewMode(true);
      setModalOpened(true);
    }
  };

  const handleEdit = async (row: Patient) => {
    const rawPatient = await fetchPatientById(row.id);
    if (rawPatient) {
      setSelectedPatient(normalizePatient(rawPatient));
      setIsViewMode(false);
      setModalOpened(true);
    }
  };

  const handleDelete = async (row: Patient) => {
    await deletePatientById(row.id);
  };

  const handleSubmit = async (data: CreateUpdatePatientRequest) => {
    try {
      if (selectedPatient) {
        await axiosInstance.put(`/patients/${selectedPatient.id}`, data);
        toast.success("Cập nhật thành công");
      } else {
        await axiosInstance.post("/patients", data);
        toast.success("Tạo thành công");
      }
      fetchAllPatients();
    } catch (error) {
      toast.error("Lỗi khi lưu thông tin bệnh nhân");
    }
  };

  const columns = [
    createColumn<Patient>({
      key: "patientCode",
      label: "Mã bệnh nhân",
      render: (row) => row.patientCode,
    }),
    createColumn<Patient>({
      key: undefined as any,
      label: "Họ và tên",
      render: (row) =>
        `${row.firstName ?? ""} ${row.middleName ?? ""} ${
          row.lastName ?? ""
        }`.trim(),
    }),
    createColumn<Patient>({
      key: "gender",
      label: "Giới tính",
      render: (row) => (row.gender === "MALE" ? "Nam" : "Nữ"),
    }),
    createColumn<Patient>({
      key: "dob",
      label: "Ngày sinh",
      render: (row) => dayjs(row.dob).format("DD/MM/YYYY"),
    }),
    createColumn<Patient>({ key: "phone", label: "SĐT" }),
    createColumn<Patient>({ key: "email", label: "Email" }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Quản lý bệnh nhân</h1>
        <Button onClick={handleAdd}>Tạo bệnh nhân</Button>
      </div>

      <div className="grid grid-cols-12 gap-4 my-4">
        <div className="col-span-12 md:col-span-4">
          <FloatingLabelWrapper label="Tìm theo mã bệnh nhân">
            <TextInput
              placeholder="Mã bệnh nhân"
              value={searchPatientCodeInput}
              onChange={(e) => setSearchPatientCodeInput(e.currentTarget.value)}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-4">
          <FloatingLabelWrapper label="Tìm theo họ tên">
            <TextInput
              placeholder="Họ tên"
              value={searchFullNameInput}
              onChange={(e) => setSearchFullNameInput(e.currentTarget.value)}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Tìm theo SĐT">
            <TextInput
              placeholder="Số điện thoại"
              value={searchPhoneInput}
              onChange={(e) => setSearchPhoneInput(e.currentTarget.value)}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2 flex items-end gap-2">
          <Button variant="light" color="gray" onClick={handleReset} fullWidth>
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            fullWidth
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={patients}
        columns={columns}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSizeOptions={setting?.paginationSizeList
          ?.slice()
          .sort((a, b) => a - b)}
      />

      <CreatePatientModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
        }}
        initialData={selectedPatient}
        onSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </>
  );
};
