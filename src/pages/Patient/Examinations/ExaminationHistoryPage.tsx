import { useEffect, useState } from "react";
import { Card, Title, Button } from "@mantine/core";
import dayjs from "dayjs";
import CustomTable from "../../../components/common/CustomTable";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { DatePickerInput } from "@mantine/dates";
import { TextInput, Select } from "@mantine/core";
import { LuEye, LuDownload } from "react-icons/lu";

import { useOutletContext } from "react-router";
import useMedicalRecord from "../../../hooks/Medical-Record/useMedicalRecord";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { createColumn } from "../../../components/utils/tableUtils";
import { MedicalRecord } from "../../../types/Admin/Medical-Record/MedicalRecord";
import {
  MedicalRecordStatus,
  MedicalRecordStatusColor,
  MedicalRecordStatusMap,
} from "../../../enums/MedicalRecord/MedicalRecordStatus";
import { usePreviewMedicalRecord } from "../../../hooks/medicalRecord/usePreviewMedicalRecord";
import PdfPreviewModal from "../../../components/common/PdfPreviewModal";

type OutletCtx = {
  patient: {
    id: string;
    patientCode: string;
    fullName: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
  } | null;
  loadingPatient: boolean;
};

const ExaminationHistoryPage = () => {
  const { patient } = useOutletContext<OutletCtx>();
  const { setting } = useSettingAdminService();
  const { previewMedicalRecord } = usePreviewMedicalRecord();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const {
    medicalRecords,
    totalItems,
    loading,
    fetchAllMedicalRecords,
    handleDownload,
  } = useMedicalRecord();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  const [filterInput, setFilterInput] = useState<{
    medicalRecordCode: string;
    status?: string;
    fromDate: Date | null;
    toDate: Date | null;
  }>({
    medicalRecordCode: "",
    status: "",
    fromDate: null,
    toDate: null,
  });

  const [filters, setFilters] = useState<{
    medicalRecordCode?: string;
    status?: string;
    fromDate?: string | null;
    toDate?: string | null;
  }>({
    medicalRecordCode: "",
    status: "",
    fromDate: null,
    toDate: null,
  });

  const formatDate = (d: Date | null) =>
    d ? dayjs(d).format("YYYY-MM-DD") : null;
  const handlePreviewInline = async (id: string) => {
    const url = await previewMedicalRecord(id);
    if (url) {
      setPdfUrl(url);
      setModalOpened(true);
    }
  };
  const handleSearch = () => {
    setFilters({
      medicalRecordCode: filterInput.medicalRecordCode.trim(),
      status: filterInput.status,
      fromDate: formatDate(filterInput.fromDate),
      toDate: formatDate(filterInput.toDate),
    });
    setPage(1);
  };

  const handleReset = () => {
    setFilterInput({
      medicalRecordCode: "",
      status: "",
      fromDate: null,
      toDate: null,
    });
    setFilters({
      medicalRecordCode: "",
      status: "",
      fromDate: null,
      toDate: null,
    });
    setPage(1);
  };

  useEffect(() => {
    if (!patient?.id) return;

    fetchAllMedicalRecords(page - 1, pageSize, {
      medicalRecordCode: filters.medicalRecordCode,
      status: filters.status,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      patientId: patient.id,
    });
  }, [patient?.id, page, pageSize, filters]);

  const columns = [
    createColumn<MedicalRecord>({
      key: "medicalRecordCode",
      label: "Mã hồ sơ",
    }),
    createColumn<MedicalRecord>({
      key: "status",
      label: "Trạng thái",
      render: (row) => {
        const s = row.status as MedicalRecordStatus;
        return (
          <span style={{ color: MedicalRecordStatusColor[s], fontWeight: 600 }}>
            {MedicalRecordStatusMap[s] ?? row.status}
          </span>
        );
      },
    }),
    createColumn<MedicalRecord>({
      key: "createdAt",
      label: "Ngày tạo",
      render: (row) => dayjs(row.createdAt).format("DD/MM/YYYY"),
    }),

    createColumn<MedicalRecord>({
      key: "actions",
      label: "Thao tác",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="light"
            color="blue"
            onClick={() => handlePreviewInline(row.id)} // ✅ dùng inline preview
            className="p-1 w-8 h-8 flex items-center justify-center"
          >
            <LuEye size={16} />
          </Button>
          <Button
            size="xs"
            variant="light"
            color="green"
            onClick={() => handleDownload(row.id)}
            className="p-1 w-8 h-8 flex items-center justify-center"
          >
            <LuDownload size={16} />
          </Button>
        </div>
      ),
    }),
    createColumn<MedicalRecord>({
      key: "feedback",
      label: "Phản hồi",
      render: (row) => (
        <Button
          size="xs"
          variant="light"
          color="violet"
          //onClick={() => handleFeedback(row)}
          className="px-2 h-8"
        >
          Góp ý
        </Button>
      ),
    }),
  ];
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    ...Object.values(MedicalRecordStatus).map((v) => ({
      value: v,
      label: MedicalRecordStatusMap[v],
    })),
  ];

  return (
    <div className="w-full px-0">
      <Card withBorder shadow="sm" radius="md" className="mb-4 p-4">
        <Title order={5} className="uppercase text-green-700 mb-3">
          Lịch sử khám bệnh - {patient?.fullName || ""}
        </Title>

        {/* Filters */}
        <div className="grid grid-cols-12 gap-4 my-4">
          <div className="col-span-12 md:col-span-3">
            <FloatingLabelWrapper label="Mã hồ sơ">
              <TextInput
                placeholder="Mã hồ sơ"
                value={filterInput.medicalRecordCode}
                onChange={(e) =>
                  setFilterInput({
                    ...filterInput,
                    medicalRecordCode: e.currentTarget.value,
                  })
                }
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-12 md:col-span-3">
            <FloatingLabelWrapper label="Trạng thái">
              <Select
                data={statusOptions}
                placeholder="Trạng thái"
                value={
                  filterInput.status && filterInput.status.length > 0
                    ? filterInput.status
                    : ""
                }
                onChange={(value) =>
                  setFilterInput((prev) => ({ ...prev, status: value || "" }))
                }
                clearable
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-12 md:col-span-2">
            <FloatingLabelWrapper label="Từ ngày">
              <DatePickerInput
                placeholder="Từ ngày"
                value={filterInput.fromDate ?? undefined}
                valueFormat="DD/MM/YYYY"
                maxDate={new Date()}
                onChange={(value) => {
                  const date = value ? new Date(value) : null;
                  if (date) date.setHours(0, 0, 0, 0);
                  setFilterInput((prev) => ({ ...prev, fromDate: date }));
                }}
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-12 md:col-span-2">
            <FloatingLabelWrapper label="Đến ngày">
              <DatePickerInput
                placeholder="Đến ngày"
                value={filterInput.toDate ?? undefined}
                valueFormat="DD/MM/YYYY"
                onChange={(value) => {
                  const date = value ? new Date(value) : null;
                  if (date) date.setHours(23, 59, 59, 999);
                  setFilterInput((prev) => ({ ...prev, toDate: date }));
                }}
              />
            </FloatingLabelWrapper>
          </div>
          <div className="col-span-12 md:col-span-2 flex items-center gap-2 md:pt-[22px]">
            <Button
              variant="light"
              color="gray"
              onClick={handleReset}
              fullWidth
              size="sm"
            >
              Tải lại
            </Button>
            <Button
              variant="filled"
              color="blue"
              onClick={handleSearch}
              fullWidth
              size="sm"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        <CustomTable
          data={medicalRecords as unknown as MedicalRecord[]}
          columns={columns}
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          loading={loading}
          showActions={false}
        />
      </Card>
      <PdfPreviewModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        pdfUrl={pdfUrl}
        title="Xem trước hóa đơn"
        widthPct={90}
        heightVh={90}
      />
    </div>
  );
};

export default ExaminationHistoryPage;
