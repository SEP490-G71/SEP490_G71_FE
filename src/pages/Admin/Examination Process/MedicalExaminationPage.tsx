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
const MedicalExaminationPage = () => {
  const { userInfo } = useUserInfo();
  const { department } = useMyDepartment();
  const { fetchStaffsById } = useStaffs();

  const [doctorName, setDoctorName] = useState("Không rõ");
  const [activeTab, setActiveTab] = useState<"info" | "service" | "history">(
    "info"
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const { patientDetail: selectedPatient } =
    useQueuePatientDetail(selectedPatientId);

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
    registeredTimeFrom: new Date().toISOString().split("T")[0],
    registeredTimeTo: new Date().toISOString().split("T")[0],
  });

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
    },

    validate: {
      temperature: (value) =>
        value < 35 || value > 42
          ? "Nhiệt độ phải trong khoảng 35°C - 42°C"
          : null,

      respiratoryRate: (value) =>
        value < 8 || value > 30
          ? "Nhịp thở phải trong khoảng 8 - 30 lần/phút"
          : null,

      bloodPressure: (value) => {
        const regex = /^\d{2,3}\/\d{2,3}$/;
        return !regex.test(value)
          ? "Huyết áp không hợp lệ (ví dụ: 120/80)"
          : null;
      },

      heartRate: (value) =>
        value < 40 || value > 180
          ? "Mạch phải trong khoảng 40 - 180 lần/phút"
          : null,

      spo2: (value) =>
        value < 70 || value > 100 ? "SpO2 phải trong khoảng 70 - 100%" : null,

      heightCm: (value) =>
        value < 50 || value > 250
          ? "Chiều cao phải trong khoảng 50 - 250 cm"
          : null,

      weightKg: (value) =>
        value < 15 || value > 120
          ? "Cân nặng phải trong khoảng 15 - 120 kg"
          : null,

      bmi: (value) =>
        value < 10 || value > 60 ? "BMI phải trong khoảng 10 - 60" : null,
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
  const serviceOptions = medicalServices.map((item) => ({
    value: item.id,
    label: item.name,
  }));

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

  const handleEndExamination = () => {
    if (selectedPatient) {
      setSelectedPatientId(null);

      toast.success("Đã kết thúc khám bệnh cho bệnh nhân.");
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      form.reset();
      setServiceRows([{ id: 1, serviceId: null, quantity: 1 }]);
    }
  }, [selectedPatientId]);

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

    console.log("📦 Payload to submit:", payload);

    await submitExamination(payload);
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
            selectedPatient={selectedPatient}
            onSelectPatient={(p) => setSelectedPatientId(p?.id ?? null)}
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
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper p="md" shadow="xs" withBorder radius={0}>
            <Flex justify="space-between" align="center" mb="sm">
              <Flex gap="xs">
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
              </Flex>

              <Button
                variant="light"
                color="red"
                size="sm"
                onClick={handleEndExamination}
                disabled={!selectedPatient}
              >
                Kết thúc khám
              </Button>
            </Flex>

            <Title order={4} mb="sm" c="blue.9" size="h5">
              1. Thông tin người đăng ký
            </Title>
            <PatientInfoPanel patient={selectedPatient} />

            <form>
              {activeTab === "info" && (
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

              {activeTab === "service" && (
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
                      editable={true}
                      showDepartment={true}
                    />
                  </ScrollArea>
                </>
              )}

              {activeTab === "history" && selectedPatient && (
                <>
                  <Title order={4} mb="sm" c="blue.9" size="h5" mt="md">
                    Lịch sử khám bệnh
                  </Title>

                  <MedicalHistoryPanel patientId={selectedPatient.id} />
                </>
              )}

              <Flex mt="md" gap="sm">
                {activeTab !== "history" && (
                  <Flex mt="md" gap="sm">
                    <Button
                      type="button"
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSave}
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
