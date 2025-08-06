import {
  Button,
  Flex,
  Grid,
  Paper,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
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
const MedicalExaminationPage = () => {
  const { userInfo } = useUserInfo();
  const { department } = useMyDepartment();
  const { defaultService } = useDefaultMedicalService(department?.id ?? null);
  const { fetchStaffsById } = useStaffs();
  const [summary, setSummary] = useState("");
  const { updateMedicalRecord } = useUpdateMedicalRecord();
  const [doctorName, setDoctorName] = useState("Không rõ");
  const [activeTab, setActiveTab] = useState<
    "info" | "service" | "history" | "detail"
  >("info");

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [activeListTab, setActiveListTab] = useState<"waiting" | "inprogress">(
    "waiting"
  );

  const [selectedMedicalRecord, setSelectedMedicalRecord] =
    useState<MedicalRecord | null>(null);
  useEffect(() => {
    if (activeListTab === "inprogress") {
      setActiveTab("detail");
    } else if (activeListTab === "waiting") {
      setActiveTab("info");
    }
  }, [activeListTab]);
  const { patientDetail: selectedPatient, refetch: refetchPatientDetail } =
    useQueuePatientDetail(selectedPatientId);
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

  const {
    recordDetail,

    fetchMedicalRecordDetail,
  } = useMedicalRecordDetail();

  useEffect(() => {
    if (recordDetail && selectedMedicalRecord) {
      form.setValues({
        diagnosisText: recordDetail.diagnosisText || "",
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
        summary: recordDetail.summary || "",
      });

      setServiceRows(
        recordDetail.orders?.map((order, index) => ({
          id: index + 1,
          serviceId: order.id,
          quantity: 1,
        })) ?? []
      );
    }
  }, [recordDetail, selectedMedicalRecord]);

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
      summary: "",
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
      summary: (value: string) =>
        value.trim() === "" ? "Tóm tắt không được để trống" : null,
    },
  });
  interface ServiceRow {
    id: number;
    serviceId: string | null;
    quantity: number;
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
          label: `${s.serviceCode} - ${s.name}`,
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
          label: `${s.serviceCode} - ${s.name}`,
        });
        return acc;
      }, {})
  ).map(([group, items]) => ({
    group,
    items,
  }));

  useEffect(() => {
    if (selectedPatient) {
      form.reset();

      const defaultRow = defaultService
        ? [
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
            {
              id: 2,
              serviceId: null,
              quantity: 1,
            },
          ]
        : [{ id: 1, serviceId: null, quantity: 1 }];

      setServiceRows(defaultRow);
    }
  }, [selectedPatient, defaultService]);

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

  useEffect(() => {
    if (selectedPatient) {
      form.reset();
      setServiceRows([{ id: 1, serviceId: null, quantity: 1 }]);
    }
  }, [selectedPatientId]);
  const handleSelectQueuePatient = (p: QueuePatient | null) => {
    form.reset();
    setServiceRows([{ id: 1, serviceId: null, quantity: 1 }]);
    setActiveTab("info");
    setSelectedMedicalRecord(null);
    setSelectedPatientId(p?.id ?? null);
    setIsQueuePatientMode(true);
  };

  const handleSelectMedicalRecord = async (record: MedicalRecord) => {
    form.reset();
    setServiceRows([{ id: 1, serviceId: null, quantity: 1 }]);
    setActiveTab("detail");
    setSelectedPatientId(null);
    setSelectedMedicalRecord(record);
    setIsQueuePatientMode(false);
    await fetchMedicalRecordDetail(record.id);
  };
  const handleSave = async () => {
    const validation = form.validate();

    if (validation.hasErrors) {
      console.log(" Validation errors:", validation.errors);
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào.");
      return;
    }

    if (!selectedPatient || !form.values.doctor) {
      toast.error("Thiếu thông tin bệnh nhân hoặc bác sĩ");
      return;
    }

    const payload = {
      patientId: selectedPatient.patientId,
      staffId: form.values.doctor,
      visitId: selectedPatient.id,
      diagnosisText: form.values.symptoms || "Chẩn đoán: chưa nhập",
      temperature: form.values.temperature,
      respiratoryRate: form.values.respiratoryRate,
      bloodPressure: form.values.bloodPressure,
      heartRate: form.values.heartRate,
      heightCm: form.values.heightCm,
      weightKg: form.values.weightKg,
      bmi: form.values.bmi,
      spo2: form.values.spo2,
      notes: form.values.notes,
      services: serviceRows,
    };

    await submitExamination(payload);
    // Cập nhật trạng thái sang WAITING_RESULT
    try {
      await updatePatientStatus(selectedPatient.id, "AWAITING_RESULT");
      toast.success("✅ Đã lưu khám và chuyển trạng thái sang chờ kết quả");
      setSelectedPatientId(null);

      updateFilters({
        roomNumber: department?.roomNumber,
        registeredTimeFrom: dayjs().format("YYYY-MM-DD"),
        registeredTimeTo: dayjs().format("YYYY-MM-DD"),
      });
    } catch {
      toast.error("❌ Lỗi khi cập nhật trạng thái bệnh nhân sau khi lưu");
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
      setSelectedPatientId(null);
    } catch {
      // Toast lỗi đã xử lý trong file updatePatientStatus.ts
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
      // toast.success("📣 Đã gọi bệnh nhân");
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
    setSelectedMedicalRecord(null);
    setSelectedPatientId(null);
    form.reset();
    setServiceRows([{ id: 1, serviceId: null, quantity: 1 }]);
    setActiveTab("info");
  };

  const handleEndExamination = async () => {
    if (!selectedMedicalRecord || !recordDetail) return;

    try {
      const payload = {
        medicalRecordId: selectedMedicalRecord.id,
        diagnosisText: form.values.diagnosisText,
        summary: summary,
        temperature: form.values.temperature,
        respiratoryRate: form.values.respiratoryRate,
        bloodPressure: form.values.bloodPressure,
        heartRate: form.values.heartRate,
        heightCm: form.values.heightCm,
        weightKg: form.values.weightKg,
        bmi: form.values.bmi,
        spo2: form.values.spo2,
        notes: form.values.notes,
      };

      const result = await updateMedicalRecord(payload);
      if (!result) return;

      // TODO: Sau khi cập nhật -> gọi API cập nhật trạng thái sang RESULT_COMPLETED
      toast.success("✅ Đã kết thúc khám và cập nhật hồ sơ");

      // Xóa lựa chọn
      setSelectedMedicalRecord(null);
      form.reset();
      setSummary("");
    } catch (error) {
      toast.error("❌ Kết thúc khám thất bại");
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
            selectedMedicalRecord={selectedMedicalRecord}
            onSelectQueuePatient={handleSelectQueuePatient}
            onSelectMedicalRecord={handleSelectMedicalRecord}
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
            }}
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

              {activeListTab === "inprogress" && (
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  disabled={
                    !selectedMedicalRecord ||
                    selectedMedicalRecord.status !== "TESTING_COMPLETED"
                  }
                  onClick={handleEndExamination}
                >
                  Kết thúc khám
                </Button>
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
                      : `record-${selectedMedicalRecord?.id ?? "empty"}`
                  }
                  patient={isQueuePatientMode ? selectedPatient : null}
                  //medicalRecord={recordDetail}
                  onConfirm={handleConfirmExamination}
                  onCancelQueue={handleCancelQueue}
                  onCallPatient={handleCallPatient}
                />
              </>
            )}
            <form>
              {activeListTab === "waiting" && activeTab === "info" && (
                <>
                  <Title order={4} mb="sm" c="blue.9" size="h5" mt="md">
                    2. Thông tin khám bệnh
                  </Title>
                  <ExaminationSectionForm
                    form={form}
                    doctorName={doctorName}
                    doctorId={userInfo?.userId ?? ""}
                    roomNumber={department?.roomNumber ?? "Không rõ"}
                    departmentName={department?.name ?? "Không rõ"}
                    departmentId={department?.id ?? ""}
                  />
                </>
              )}

              {activeListTab === "waiting" && activeTab === "service" && (
                <>
                  <Title order={4} mb="sm" c="blue.9" size="h5" mt="md">
                    3. Kê dịch vụ
                  </Title>
                  <Flex justify="space-between" align="center" mt="sm" mb="sm">
                    <Text fw={600}>Danh sách dịch vụ</Text>
                  </Flex>

                  <ScrollArea offsetScrollbars scrollbarSize={8}>
                    <ServiceTable
                      serviceRows={serviceRows}
                      setServiceRows={setServiceRows}
                      medicalServices={medicalServices}
                      serviceOptions={serviceOptions}
                      nonDefaultServiceOptions={nonDefaultServiceOptions}
                      defaultServiceIds={defaultServiceIds}
                      editable={true}
                      showDepartment={true}
                      allowSelectDefaultServices={true}
                    />
                  </ScrollArea>
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

              {activeListTab === "inprogress" && activeTab === "detail" && (
                <>
                  <ScrollArea h={400}>
                    {selectedMedicalRecord ? (
                      recordDetail ? (
                        <PatientDetailSection
                          detail={recordDetail}
                          form={form}
                          summaryValue={summary}
                          onSummaryChange={setSummary}
                        />
                      ) : (
                        <Text c="dimmed" fs="italic" mt="sm">
                          Đang tải chi tiết hồ sơ...
                        </Text>
                      )
                    ) : (
                      <Text c="dimmed" fs="italic" mt="sm">
                        Vui lòng chọn bệnh nhân từ danh sách "Đang khám" để xem
                        chi tiết hồ sơ.
                      </Text>
                    )}
                  </ScrollArea>
                </>
              )}

              <Flex mt="md" gap="sm">
                {activeListTab === "waiting" && activeTab !== "history" && (
                  <Flex mt="md" gap="sm">
                    <Button
                      type="button"
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSave}
                      disabled={selectedPatient?.status !== "IN_PROGRESS"}
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
    </>
  );
};

export default MedicalExaminationPage;
