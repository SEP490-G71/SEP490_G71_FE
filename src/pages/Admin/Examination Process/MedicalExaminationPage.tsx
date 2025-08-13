import {
  Button,
  Flex,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import PatientPanel from "../../../components/patient/PatientPanel";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import useQueuePatientService from "../../../hooks/queue-patients/useSearchQueuePatients";
import ServiceTable from "../../../components/medical-examination/MedicalServiceTable";
import { IconDeviceFloppy } from "@tabler/icons-react";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import useMyDepartment from "../../../hooks/department-service/useMyDepartment";
import { useUserInfo } from "../../../hooks/auth/useUserInfo";
import useQueuePatientDetail from "../../../hooks/queue-patients/useQueuePatientDetail";
import useMedicalRecord from "../../../hooks/medicalRecord/useMedicalRecord";
import { toast } from "react-toastify";
import MedicalHistoryPanel from "../../../components/medical-examination/MedicalHistoryPanel";
import ExaminationSectionForm from "../../../components/medical-examination/ExaminationSectionForm";
import useStaffs from "../../../hooks/staffs-service/useStaffs";
import updatePatientStatus from "../../../hooks/queue-patients/updatePatientStatus";
import { vitalSignValidators } from "../../../components/utils/vitalSignValidators";
import useDefaultMedicalService from "../../../hooks/department-service/useDefaultMedicalService";
import { MedicalRecord } from "../../../types/MedicalRecord/MedicalRecord";
import useMedicalRecordDetail from "../../../hooks/medicalRecord/useMedicalRecordDetail";
import { QueuePatient } from "../../../types/Queue-patient/QueuePatient";
import dayjs from "dayjs";
import PatientDetailSection from "../../../components/medical-examination/PatientDetailModal";
import useUpdateMedicalRecord from "../../../hooks/medicalRecord/useUpdateMedicalRecord";
import finishMedicalRecord from "../../../hooks/medicalRecord/finishMedicalRecord";
import { useAddServicesAsNewInvoice } from "../../../hooks/medicalRecord/useAddNewInvoice";
import AddServiceModal from "../../../components/medical-examination/AddServiceModal";
import { useTransferRoom } from "../../../hooks/TransferRoom/useTransferRoom";
import TransferRoomModal from "../../../components/medical-examination/TransferRoomModal";

const MedicalExaminationPage = () => {
  const { userInfo } = useUserInfo();
  const { department } = useMyDepartment();
  const { defaultService } = useDefaultMedicalService(department?.id ?? null);
  const { fetchStaffsById } = useStaffs();
  const [summary, setSummary] = useState("");
  const { updateMedicalRecord } = useUpdateMedicalRecord();
  const [doctorName, setDoctorName] = useState("Không rõ");
  const { addServicesAsNewInvoice } = useAddServicesAsNewInvoice();
  const [addServiceOpened, setAddServiceOpened] = useState(false);
  const [transferOpened, setTransferOpened] = useState(false);
  const { transferRoom } = useTransferRoom();
  const [activeTab, setActiveTab] = useState<
    "info" | "service" | "history" | "detail"
  >("info");

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  type ListTab = "waiting" | "inprogress" | "transfers";
  const [activeListTab, setActiveListTab] = useState<ListTab>("waiting");

  const [selectedMedicalRecordInprogress, setSelectedMedicalRecordInprogress] =
    useState<MedicalRecord | null>(null);
  const [selectedMedicalRecordTransfer, setSelectedMedicalRecordTransfer] =
    useState<MedicalRecord | null>(null);
  const hasSelectionOnThisTab =
    (activeListTab === "inprogress" && !!selectedMedicalRecordInprogress) ||
    (activeListTab === "transfers" && !!selectedMedicalRecordTransfer);
  const currentSelectedMedicalRecord = useMemo(
    () =>
      activeListTab === "inprogress"
        ? selectedMedicalRecordInprogress
        : activeListTab === "transfers"
        ? selectedMedicalRecordTransfer
        : null,
    [
      activeListTab,
      selectedMedicalRecordInprogress,
      selectedMedicalRecordTransfer,
    ]
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeListTab === "inprogress" || activeListTab === "transfers") {
      setActiveTab("detail");
    } else if (activeListTab === "waiting") {
      setActiveTab("info");
    }
  }, [activeListTab]);

  const { patientDetail: selectedPatient, refetch: refetchPatientDetail } =
    useQueuePatientDetail(selectedPatientId);

  const handleQueueStatusChanged = async (id: string) => {
    if (selectedPatientId === id) {
      await refetchPatientDetail();
    }
  };

  const handleConfirmExamination = async () => {
    if (!selectedPatient) return;
    if (selectedPatient.status !== "CALLING") {
      toast.error("❌ Chỉ được xác nhận khi bệnh nhân đang được gọi vào khám.");
      return;
    }
    try {
      await updatePatientStatus(selectedPatient.id, "IN_PROGRESS");
      toast.success("✅ Bệnh nhân đã vào khám");
      await refetchPatientDetail();
      updateFilters({
        roomNumber: department?.roomNumber,
        registeredTimeFrom: dayjs().format("YYYY-MM-DD"),
        registeredTimeTo: dayjs().format("YYYY-MM-DD"),
      });
    } catch {}
  };

  const isInProgress = selectedPatient?.status === "IN_PROGRESS";
  const [isQueuePatientMode, setIsQueuePatientMode] = useState(true);

  const {
    patients,
    totalItems,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    loading,
    updateFilters,
  } = useQueuePatientService({
    roomNumber: department?.roomNumber ?? "",
    registeredTimeFrom: dayjs().format("YYYY-MM-DD"),
    registeredTimeTo: dayjs().format("YYYY-MM-DD"),
    status: "",
  });

  const { recordDetail, fetchMedicalRecordDetail } = useMedicalRecordDetail();

  useEffect(() => {
    if (recordDetail && currentSelectedMedicalRecord) {
      form.setValues({
        diagnosisText:
          recordDetail.diagnosisText?.trim() || "Chưa có chẩn đoán",
        appointmentDate: new Date(),
        doctor: userInfo?.userId ?? "",
        department: department?.id ?? "",
        symptoms: recordDetail.diagnosisText || "",
        notes: recordDetail.notes || "",
        temperature: recordDetail.temperature,
        respiratoryRate: recordDetail.respiratoryRate,
        bloodPressure: recordDetail.bloodPressure,
        heartRate: recordDetail.heartRate,
        heightCm: recordDetail.heightCm,
        weightKg: recordDetail.weightKg,
        bmi: recordDetail.bmi,
        spo2: recordDetail.spo2,
      });
      setSummary(recordDetail.summary || "");
      setServiceRows(
        recordDetail.orders?.map((order, index) => ({
          id: index + 1,
          serviceId: order.id,
          quantity: 1,
        })) ?? []
      );
    }
  }, [recordDetail, currentSelectedMedicalRecord]);

  const form = useForm({
    initialValues: {
      appointmentDate: new Date(),
      doctor: "",
      department: "",
      symptoms: "",
      notes: "Không",
      temperature: 0,
      respiratoryRate: 0,
      bloodPressure: "",
      heartRate: 0,
      heightCm: 0,
      weightKg: 0,
      bmi: 0,
      spo2: 0,
      diagnosisText: "",
    },
    validate: {
      temperature: vitalSignValidators.temperature,
      respiratoryRate: vitalSignValidators.respiratoryRate,
      bloodPressure: vitalSignValidators.bloodPressure,
      heartRate: vitalSignValidators.heartRate,
      spo2: vitalSignValidators.spo2,
      heightCm: vitalSignValidators.heightCm,
      weightKg: vitalSignValidators.weightKg,
      bmi: vitalSignValidators.bmi,
      diagnosisText: (value: string) =>
        value.trim() === "" ? "Chẩn đoán không được để trống" : null,
    },
  });

  interface ServiceRow {
    id: number;
    serviceId: string | null;
    quantity: number;
    serviceCode?: string;
    name?: string;
    price?: number;
    discount?: number;
    vat?: number;
    departmentName?: string;
    total?: number;
    isDefault?: boolean;
  }

  const [serviceRows, setServiceRows] = useState<ServiceRow[]>([
    { id: 1, serviceId: null, quantity: 1 },
  ]);

  const { medicalServices, fetchAllMedicalServicesNoPagination } =
    useMedicalService();

  const defaultServiceIds = medicalServices
    .filter((s) => s.defaultService)
    .map((s) => s.id);

  const serviceOptions = Object.entries(
    medicalServices.reduce<Record<string, { value: string; label: string }[]>>(
      (acc, s) => {
        const group = s.department?.specialization?.name || "Khác";
        if (!acc[group]) acc[group] = [];
        acc[group].push({
          value: s.id,
          label: `${s.serviceCode} - ${s.name} - ${s.department.roomNumber}`,
        });
        return acc;
      },
      {}
    )
  ).map(([group, items]) => ({
    group,
    items,
  }));

  const nonDefaultServiceOptions = Object.entries(
    medicalServices
      .filter((s) => !s.defaultService)
      .reduce<Record<string, { value: string; label: string }[]>>((acc, s) => {
        const group = s.department?.specialization?.name || "Khác";
        if (!acc[group]) acc[group] = [];
        acc[group].push({
          value: s.id,
          label: `${s.serviceCode} - ${s.name} - ${s.department.roomNumber}`,
        });
        return acc;
      }, {})
  ).map(([group, items]) => ({
    group,
    items,
  }));

  useEffect(() => {
    setServiceRows((prev) => {
      if (prev.some((r) => !!r.serviceId)) return prev;
      if (!isInProgress) {
        return prev.length ? prev : [{ id: 1, serviceId: null, quantity: 1 }];
      }
      if (defaultService) {
        return [
          {
            id: 1,
            serviceId: defaultService.id,
            serviceCode: defaultService.serviceCode,
            name: defaultService.name,
            price: defaultService.price,
            quantity: 1,
            discount: defaultService.discount,
            vat: defaultService.vat,
            departmentName: defaultService.department?.name || "",
            total: Math.round(defaultService.price),
            isDefault: true,
          },
          { id: 2, serviceId: null, quantity: 1 },
        ];
      }
      return [{ id: 1, serviceId: null, quantity: 1 }];
    });
  }, [defaultService?.id, selectedPatientId, isInProgress]);

  useEffect(() => {
    if (department?.roomNumber) {
      updateFilters({
        roomNumber: department.roomNumber,
        registeredTimeFrom: dayjs().format("YYYY-MM-DD"),
        registeredTimeTo: dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [department?.roomNumber]);

  useEffect(() => {
    fetchAllMedicalServicesNoPagination();
  }, []);

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (userInfo?.userId) {
        const data = await fetchStaffsById(userInfo.userId);
        if (data) setDoctorName(data.fullName || "Không rõ");
      }
    };
    fetchDoctorName();
  }, [userInfo?.userId]);

  const totalPages = Math.ceil(totalItems / pageSize);
  const { submitExamination } = useMedicalRecord();

  const handleSelectQueuePatient = (p: QueuePatient | null) => {
    form.reset();
    setServiceRows([]);
    setActiveTab("info");
    setSelectedPatientId(p?.id ?? null);
    setSelectedMedicalRecordInprogress(null);
    setSelectedMedicalRecordTransfer(null);
    setIsQueuePatientMode(true);
  };

  const handleSelectMedicalRecordInprogress = async (record: MedicalRecord) => {
    form.reset();
    setServiceRows([]);
    setActiveTab("detail");
    setSelectedPatientId(null);
    setIsQueuePatientMode(false);

    setSelectedMedicalRecordInprogress(record);
    await fetchMedicalRecordDetail(record.id);
  };

  const handleSelectMedicalRecordTransfer = async (record: MedicalRecord) => {
    form.reset();
    setServiceRows([]);
    setActiveTab("detail");
    setSelectedPatientId(null);
    setIsQueuePatientMode(false);

    setSelectedMedicalRecordTransfer(record);
    await fetchMedicalRecordDetail(record.id);
  };

  const handleSave = async () => {
    if (saving) return;

    const validation = form.validate();
    if (validation.hasErrors) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào.");
      return;
    }
    if (!selectedPatientId || !selectedPatient || !form.values.doctor) {
      toast.error("Thiếu thông tin bệnh nhân hoặc bác sĩ");
      return;
    }

    const servicesDto = serviceRows
      .filter((r) => r.serviceId && (r.quantity ?? 0) > 0)
      .map((r) => ({
        serviceId: r.serviceId as string,
        quantity: Number(r.quantity || 1),
      }));

    if (servicesDto.length === 0) {
      toast.error("Chưa chọn dịch vụ nào.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        patientId: selectedPatient.patientId,
        staffId: form.values.doctor,
        visitId: selectedPatient.id,
        diagnosisText:
          form.values.diagnosisText.trim() || "Chẩn đoán: chưa nhập",
        temperature: form.values.temperature,
        respiratoryRate: form.values.respiratoryRate,
        bloodPressure: form.values.bloodPressure,
        heartRate: form.values.heartRate,
        heightCm: form.values.heightCm,
        weightKg: form.values.weightKg,
        bmi: form.values.bmi,
        spo2: form.values.spo2,
        notes: form.values.notes,
        services: servicesDto,
      };

      await submitExamination(payload);
      await updatePatientStatus(selectedPatient.id, "AWAITING_RESULT");
      await refetchPatientDetail(); // đảm bảo detail cập nhật
      updateFilters({
        roomNumber: department?.roomNumber,
        registeredTimeFrom: dayjs().format("YYYY-MM-DD"),
        registeredTimeTo: dayjs().format("YYYY-MM-DD"),
      });

      // Reset UI để khóa nút
      setSelectedPatientId(null);
      form.reset();
      setServiceRows([{ id: 1, serviceId: null, quantity: 1 }]);
      setActiveTab("info");

      toast.success("✅ Đã lưu khám và chuyển sang chờ kết quả");
    } catch (e) {
      toast.error("❌ Lưu khám thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelQueue = async () => {
    if (!selectedPatient) return;

    if (selectedPatient.status !== "CALLING") {
      toast.error("❌ Chỉ huỷ được bệnh nhân đang ở trạng thái gọi.");
      return;
    }

    try {
      await updatePatientStatus(selectedPatient.id, "CANCELED");
      toast.success("🚫 Đã huỷ gọi bệnh nhân");
      await refetchPatientDetail();
      updateFilters({
        roomNumber: department?.roomNumber,
        registeredTimeFrom: dayjs().format("YYYY-MM-DD"),
        registeredTimeTo: dayjs().format("YYYY-MM-DD"),
      });

      setSelectedPatientId(null);
    } catch {
      toast.error("❌ Huỷ gọi bệnh nhân thất bại");
    }
  };

  const handleCallPatient = async () => {
    if (!selectedPatient) return;

    if (selectedPatient.status !== "WAITING") {
      toast.error("❌ Chỉ gọi được bệnh nhân đang chờ.");
      return;
    }

    try {
      await updatePatientStatus(selectedPatient.id, "CALLING");
      await refetchPatientDetail();
      updateFilters({
        roomNumber: department?.roomNumber,
        registeredTimeFrom: dayjs().format("YYYY-MM-DD"),
        registeredTimeTo: dayjs().format("YYYY-MM-DD"),
      });
      setSelectedPatientId(null);
    } catch {}
  };

  const handleSwitchListReset = () => {
    setSelectedMedicalRecordInprogress(null);
    setSelectedMedicalRecordTransfer(null);
    setSelectedPatientId(null);
    form.reset();
    setServiceRows([{ id: 1, serviceId: null, quantity: 1 }]);
    setActiveTab("info");
  };

  const handleEndExamination = async () => {
    if (!currentSelectedMedicalRecord) return;
    if (!summary || summary.trim() === "") {
      toast.error("❌ Tổng kết không được để trống.");
      return;
    }

    if (recordDetail?.status !== "TESTING_COMPLETED") {
      toast.error(
        "❌ Chỉ được kết thúc khi trạng thái là 'Đã hoàn xét nghiệm'."
      );
      return;
    }

    try {
      await finishMedicalRecord(currentSelectedMedicalRecord.id);
      toast.success("✅ Đã kết thúc khám");
      setSelectedMedicalRecordInprogress(null);
      setSelectedMedicalRecordTransfer(null);
      form.reset();
      setSummary("");
    } catch (error) {
      toast.error("❌ Lỗi khi kết thúc khám");
    }
  };

  const handleSaveSummaryOnly = async () => {
    if (!currentSelectedMedicalRecord || !recordDetail) return;

    if (!form.values.diagnosisText || form.values.diagnosisText.trim() === "") {
      toast.error("❌ Chẩn đoán không được để trống.");
      return;
    }

    if (!summary || summary.trim() === "") {
      toast.error("❌ Tổng kết được để trống.");
      return;
    }

    const payload = {
      medicalRecordId: currentSelectedMedicalRecord.id,
      diagnosisText: form.values.diagnosisText,
      summary: summary.trim(),
      temperature: recordDetail.temperature,
      respiratoryRate: recordDetail.respiratoryRate,
      bloodPressure: recordDetail.bloodPressure,
      heartRate: recordDetail.heartRate,
      heightCm: recordDetail.heightCm,
      weightKg: recordDetail.weightKg,
      bmi: recordDetail.bmi,
      spo2: recordDetail.spo2,
      notes: form.values.notes,
    };

    const result = await updateMedicalRecord(payload);
    if (result) {
      toast.success("✅ Đã lưu tổng kết và chẩn đoán");
    }
  };

  const handleAddServiceInDetail = () => {
    if (!currentSelectedMedicalRecord) {
      toast.error("❌ Chưa chọn hồ sơ khám");
      return;
    }
    setAddServiceOpened(true);
  };

  const handleConfirmAddServices = async (
    services: { serviceId: string; quantity: number }[],
    note?: string
  ) => {
    if (!currentSelectedMedicalRecord) return;

    if (services.length === 0) {
      toast.error("❌ Chưa chọn dịch vụ hợp lệ.");
      return;
    }

    try {
      await addServicesAsNewInvoice(currentSelectedMedicalRecord.id, {
        services,
        note,
      });
      toast.success("✅ Đã thêm dịch vụ mới");
      setAddServiceOpened(false);
      await fetchMedicalRecordDetail(currentSelectedMedicalRecord.id);
    } catch {
      toast.error("❌ Thêm dịch vụ thất bại");
    }
  };

  const handleConfirmTransfer = async (payload: {
    toDepartmentNumber: string;
    reason: string;
  }) => {
    if (!currentSelectedMedicalRecord) return;
    try {
      await transferRoom(currentSelectedMedicalRecord.id, payload);
      setTransferOpened(false);
      await fetchMedicalRecordDetail(currentSelectedMedicalRecord.id);
    } catch {
      // toast đã bắn trong hook
    }
  };

  return (
    <>
      {department && (
        <Text
          size="sm"
          fw={500}
          px="md"
          mb={0}
          c="red"
          style={{ borderRadius: 4 }}
        >
          {department.roomNumber}
          {" - "}
          {department.specialization?.name ?? "Không có"}
        </Text>
      )}

      <Grid p="md" gutter="md" align="stretch">
        <Grid.Col span={{ base: 12, md: 5 }} style={{ height: "100%" }}>
          <PatientPanel
            selectedQueuePatient={selectedPatient}
            selectedMedicalRecordInprogress={selectedMedicalRecordInprogress}
            selectedMedicalRecordTransfer={selectedMedicalRecordTransfer}
            // 2 callback riêng:
            onSelectMedicalRecordInprogress={
              handleSelectMedicalRecordInprogress
            }
            onSelectMedicalRecordTransfer={handleSelectMedicalRecordTransfer}
            onSelectQueuePatient={handleSelectQueuePatient}
            onSwitchListReset={handleSwitchListReset}
            patients={patients}
            totalElements={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
            department={department}
            updateFilters={updateFilters}
            onTabChange={(tab) => {
              setActiveListTab(tab);
              setActiveTab(tab === "waiting" ? "info" : "detail");
              // (tuỳ chọn) clear selection khi đổi tab để không giữ highlight cũ
              if (tab === "inprogress") setSelectedMedicalRecordTransfer(null);
              if (tab === "transfers") setSelectedMedicalRecordInprogress(null);
            }}
            onQueueStatusChanged={handleQueueStatusChanged}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper p="md" shadow="xs" withBorder radius={0}>
            <Flex justify="space-between" align="center" mb="sm">
              <Flex gap="xs">
                {activeListTab === "waiting" ? (
                  <>
                    <Button
                      size="sm"
                      variant={activeTab === "info" ? "filled" : "outline"}
                      onClick={() => setActiveTab("info")}
                    >
                      Thông tin khám
                    </Button>
                    <Button
                      size="sm"
                      variant={activeTab === "service" ? "filled" : "outline"}
                      onClick={() => setActiveTab("service")}
                    >
                      Kê dịch vụ
                    </Button>
                    <Button
                      size="sm"
                      variant={activeTab === "history" ? "filled" : "outline"}
                      onClick={() => setActiveTab("history")}
                    >
                      Lịch sử khám
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant={activeTab === "detail" ? "filled" : "outline"}
                    onClick={() => setActiveTab("detail")}
                  >
                    Chi tiết
                  </Button>
                )}
              </Flex>

              {hasSelectionOnThisTab &&
                recordDetail?.status === "TESTING_COMPLETED" && (
                  <Group gap="sm">
                    <Button
                      variant="light"
                      color="red"
                      size="sm"
                      disabled={!currentSelectedMedicalRecord}
                      onClick={handleEndExamination}
                    >
                      Kết thúc khám
                    </Button>

                    <Button
                      variant="outline"
                      color="blue"
                      size="sm"
                      onClick={() => setTransferOpened(true)}
                    >
                      Chuyển phòng
                    </Button>
                  </Group>
                )}
            </Flex>

            {activeListTab === "waiting" && (
              <>
                <Title order={4} mb="sm" c="blue.9" size="h5">
                  1. Thông tin người đăng ký
                </Title>
                <PatientInfoPanel
                  key={
                    isQueuePatientMode
                      ? `queue-${selectedPatient?.id ?? "empty"}`
                      : `record-${currentSelectedMedicalRecord?.id ?? "empty"}`
                  }
                  patient={isQueuePatientMode ? selectedPatient : null}
                  onConfirm={handleConfirmExamination}
                  onCancelQueue={handleCancelQueue}
                  onCallPatient={handleCallPatient}
                />
              </>
            )}

            <form>
              {activeListTab === "waiting" && activeTab === "info" && (
                <>
                  {!isInProgress && (
                    <Text c="red.6" fw={500} mb="sm">
                      Chỉ khi trạng thái là <b>Đang thực hiện</b> mới có thể
                      nhập thông tin.
                    </Text>
                  )}

                  <div
                    style={{
                      pointerEvents: isInProgress && !saving ? "auto" : "none",
                      opacity: isInProgress && !saving ? 1 : 0.8,
                    }}
                  >
                    <ExaminationSectionForm
                      form={form}
                      doctorName={doctorName}
                      doctorId={userInfo?.userId ?? ""}
                      roomNumber={department?.roomNumber ?? "Không rõ"}
                      departmentName={department?.name ?? "Không rõ"}
                      departmentId={department?.id ?? ""}
                    />
                  </div>
                </>
              )}

              {activeListTab === "waiting" && activeTab === "service" && (
                <>
                  <Title order={4} mb="sm" c="blue.9" size="h5" mt="md">
                    3. Kê dịch vụ
                  </Title>
                  {!isInProgress && (
                    <Text c="red.6" fw={500} mb="sm">
                      Chỉ khi trạng thái là <b>Đang thực hiện</b> mới có thể
                      nhập thông tin.
                    </Text>
                  )}
                  <div
                    style={{
                      pointerEvents: isInProgress && !saving ? "auto" : "none",
                      opacity: isInProgress && !saving ? 1 : 0.6,
                    }}
                  >
                    <ServiceTable
                      serviceRows={serviceRows}
                      setServiceRows={setServiceRows}
                      medicalServices={medicalServices}
                      serviceOptions={serviceOptions}
                      nonDefaultServiceOptions={nonDefaultServiceOptions}
                      defaultServiceIds={defaultServiceIds}
                      editable={isInProgress && !saving}
                      showDepartment={true}
                      allowSelectDefaultServices={true}
                    />
                  </div>
                </>
              )}

              {activeListTab === "waiting" &&
                activeTab === "history" &&
                selectedPatient && (
                  <>
                    <Title order={4} mb="sm" c="blue.9" size="h5" mt="md">
                      Lịch sử khám bệnh
                    </Title>
                    <MedicalHistoryPanel
                      patientId={selectedPatient.patientId}
                    />
                  </>
                )}
              {(activeListTab === "inprogress" ||
                activeListTab === "transfers") &&
                activeTab === "detail" && (
                  <ScrollArea.Autosize
                    mah={700}
                    scrollbarSize={8}
                    offsetScrollbars
                    type="auto"
                  >
                    {currentSelectedMedicalRecord ? (
                      recordDetail ? (
                        <PatientDetailSection
                          detail={recordDetail}
                          form={form}
                          summaryValue={summary}
                          onSummaryChange={setSummary}
                          onSave={handleSaveSummaryOnly}
                          onAddService={handleAddServiceInDetail}
                        />
                      ) : (
                        <Text c="dimmed" fs="italic" mt="sm">
                          Đang tải chi tiết hồ sơ...
                        </Text>
                      )
                    ) : (
                      <Text c="dimmed" fs="italic" mt="sm">
                        Vui lòng chọn bệnh nhân từ danh sách "
                        {activeListTab === "inprogress"
                          ? "Đang khám"
                          : "Chuyển vào"}
                        " để xem chi tiết hồ sơ.
                      </Text>
                    )}
                  </ScrollArea.Autosize>
                )}

              <Flex mt="md" gap="sm">
                {activeListTab === "waiting" && activeTab !== "history" && (
                  <Flex mt="md" gap="sm">
                    <Button
                      type="button"
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSave}
                      disabled={
                        saving ||
                        !selectedPatientId ||
                        selectedPatient?.status !== "IN_PROGRESS"
                      }
                      loading={saving}
                    >
                      Lưu
                    </Button>
                  </Flex>
                )}
              </Flex>
            </form>
          </Paper>
        </Grid.Col>
      </Grid>

      <AddServiceModal
        opened={addServiceOpened}
        onClose={() => setAddServiceOpened(false)}
        onConfirm={handleConfirmAddServices}
        medicalServices={medicalServices}
        serviceOptions={serviceOptions}
        nonDefaultServiceOptions={nonDefaultServiceOptions}
        defaultServiceIds={defaultServiceIds}
        allowSelectDefaultServices={true}
      />

      <TransferRoomModal
        opened={transferOpened}
        onClose={() => setTransferOpened(false)}
        onConfirm={handleConfirmTransfer}
      />
    </>
  );
};

export default MedicalExaminationPage;
