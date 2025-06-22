import {
  Button,
  Divider,
  Flex,
  Grid,
  Paper,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import PatientPanel from "../../../components/patient/PatientPanel";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import useDepartmentService from "../../../hooks/department-service/useDepartmentService";
import useDepartmentStaffs from "../../../hooks/department-Staffs/useDepartmentStaffs";
import { Patient } from "../../../types/Patient/Patient";

const MedicalExaminationPage = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientList, setPatientList] = useState<Patient[]>([
    {
      stt: 1,
      maKcb: "2506180001",
      maBn: "00000141",
      ten: "Nguyễn Văn A",
      sdt: "0967622356",
      ngaySinh: "15/08/2019",
      gioiTinh: "Nam",
      ngayDangKy: "09/08/2023",
      phong: "Phòng nội tổng quát",
      diaChi: "Thanh Hoá",
      soDangKy: 1,
      trangThai: "hoàn thành",
    },
    {
      stt: 2,
      maKcb: "2506180002",
      maBn: "00000143",
      ten: "Nguyễn Văn B",
      sdt: "0912345678",
      ngaySinh: "12/12/1990",
      gioiTinh: "Nam",
      ngayDangKy: "10/08/2023",
      phong: "Phòng tim mạch",
      diaChi: "Hà Nội",
      soDangKy: 2,
      trangThai: "tạm dừng",
    },
    {
      stt: 3,
      maKcb: "2506180003",
      maBn: "00000144",
      ten: "Trần Thị C",
      sdt: "0988888888",
      ngaySinh: "20/05/1985",
      gioiTinh: "Nữ",
      ngayDangKy: "10/08/2023",
      phong: "Phòng nội tổng quát",
      diaChi: "Nghệ An",
      soDangKy: 3,
      trangThai: "đang khám",
    },
    {
      stt: 4,
      maKcb: "2506180004",
      maBn: "00000145",
      ten: "Phạm Văn D",
      sdt: "0977777777",
      ngaySinh: "01/01/1970",
      gioiTinh: "Nam",
      ngayDangKy: "10/08/2023",
      phong: "Phòng tiêu hoá",
      diaChi: "Hải Phòng",
      soDangKy: 4,
      trangThai: "đang khám",
    },
    {
      stt: 5,
      maKcb: "2506180005",
      maBn: "00000146",
      ten: "Dương Thị E",
      sdt: "0977777777",
      ngaySinh: "01/01/1970",
      gioiTinh: "Nam",
      ngayDangKy: "10/08/2023",
      phong: "Phòng tiêu hoá",
      diaChi: "Hà Nội",
      soDangKy: 4,
      trangThai: "chờ khám",
    },
  ]);

  const form = useForm({
    initialValues: {
      appointmentDate: new Date(),
      doctor: "",
      department: "",
      temperature: "",
      breathingRate: "",
      bloodPressure: "",
      heartRate: "",
      height: "",
      weight: "",
      bmi: "",
      spo2: "",
      symptoms: "",
      notes: "Không",
    },
  });

  const {
    departments,
    fetchAllDepartments,
    loading: departmentLoading,
  } = useDepartmentService();

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  const selectedDepartmentId = form.values.department;
  const { data: departmentStaffs = [], loading: staffLoading } =
    useDepartmentStaffs(selectedDepartmentId);

  const doctorStaffIds = new Set(
    departmentStaffs
      .filter((s) => s.position === "DOCTOR")
      .map((s) => s.staffId)
  );

  const uniqueDoctorStaffs = Array.from(
    new Map(
      departmentStaffs
        .filter((s) => doctorStaffIds.has(s.staffId))
        .map((s) => [s.staffId, s])
    ).values()
  );

  const doctorOptions = uniqueDoctorStaffs.map((staff) => {
    const fullName = [staff.lastName, staff.middleName, staff.firstName]
      .filter(Boolean)
      .join(" ");
    return {
      value: staff.staffId,
      label: fullName,
    };
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (
      selectedPatient &&
      selectedPatient.trangThai.toLowerCase() === "chờ khám"
    ) {
      const updatedPatient = { ...selectedPatient, trangThai: "đang khám" };
      const updatedList = patientList.map((p) =>
        p.maBn === selectedPatient.maBn ? updatedPatient : p
      );
      setPatientList(updatedList);
      setSelectedPatient(updatedPatient);
    }
    console.log("Submitted values:", values);
  };

  const handleEndExamination = () => {
    if (
      selectedPatient &&
      selectedPatient.trangThai.toLowerCase() === "đang khám"
    ) {
      const updatedPatient = { ...selectedPatient, trangThai: "hoàn thành" };
      const updatedList = patientList.map((p) =>
        p.maBn === selectedPatient.maBn ? updatedPatient : p
      );
      setPatientList(updatedList);
      setSelectedPatient(updatedPatient);
    }
  };

  return (
    <Grid p="md" gutter="md" align="start">
      <PatientPanel
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
        patientList={patientList}
        setPatientList={setPatientList}
      />
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Paper>
          <PatientInfoPanel patient={selectedPatient} />

          <Divider my="sm" label="Thông tin khám bệnh" labelPosition="left" />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid gutter="xs">
              <Grid.Col span={4}>
                <DateTimePicker
                  label="Ngày khám"
                  value={form.values.appointmentDate}
                  required
                />
              </Grid.Col>

              <Grid.Col span={4}>
                <Select
                  label="Bác sĩ"
                  placeholder={staffLoading ? "Đang tải..." : "Chọn bác sĩ"}
                  data={doctorOptions}
                  searchable
                  disabled={staffLoading || !selectedDepartmentId}
                  {...form.getInputProps("doctor")}
                  required
                />
              </Grid.Col>

              <Grid.Col span={4}>
                <Select
                  label="Phòng khám"
                  placeholder={
                    departmentLoading ? "Đang tải..." : "Chọn phòng khám"
                  }
                  data={departments.map((d) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                  searchable
                  disabled={departmentLoading}
                  {...form.getInputProps("department")}
                  required
                />
              </Grid.Col>

              <Grid.Col span={3}>
                <TextInput
                  label="Nhiệt độ"
                  {...form.getInputProps("temperature")}
                />
              </Grid.Col>

              <Grid.Col span={3}>
                <TextInput
                  label="Nhịp thở"
                  {...form.getInputProps("breathingRate")}
                />
              </Grid.Col>

              <Grid.Col span={3}>
                <TextInput
                  label="Huyết áp"
                  {...form.getInputProps("bloodPressure")}
                />
              </Grid.Col>

              <Grid.Col span={3}>
                <TextInput label="Mạch" {...form.getInputProps("heartRate")} />
              </Grid.Col>

              <Grid.Col span={3}>
                <TextInput
                  label="Chiều cao"
                  {...form.getInputProps("height")}
                />
              </Grid.Col>

              <Grid.Col span={3}>
                <TextInput label="Cân nặng" {...form.getInputProps("weight")} />
              </Grid.Col>

              <Grid.Col span={3}>
                <TextInput label="BMI" {...form.getInputProps("bmi")} />
              </Grid.Col>

              <Grid.Col span={3}>
                <TextInput label="SPO2" {...form.getInputProps("spo2")} />
              </Grid.Col>
            </Grid>

            <Textarea
              mt="md"
              label="Triệu chứng"
              minRows={2}
              {...form.getInputProps("symptoms")}
            />

            <Textarea
              mt="md"
              label="Ghi chú"
              minRows={2}
              {...form.getInputProps("notes")}
            />

            <Flex mt="md" gap="sm">
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
              >
                Lưu
              </Button>

              {selectedPatient?.trangThai.toLowerCase() === "đang khám" && (
                <Button
                  variant="light"
                  color="red"
                  onClick={handleEndExamination}
                >
                  Kết thúc khám
                </Button>
              )}
            </Flex>
          </form>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default MedicalExaminationPage;
