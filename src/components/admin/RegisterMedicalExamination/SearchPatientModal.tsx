// File: SearchPatientModal.tsx
import {
  Button,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Table,
  TextInput,
} from "@mantine/core";
import { Patient } from "../../../types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";

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
          <Grid.Col span={3}>
            <TextInput label="Mã BN" placeholder="Nhập mã" />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Họ tên" placeholder="Nhập họ tên" />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Điện thoại" placeholder="Nhập SĐT" />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Tài khoản" placeholder="Tài khoản" />
          </Grid.Col>
        </Grid>

        <ScrollArea h={350}>
          <Table
            striped
            highlightOnHover
            withColumnBorders
            verticalSpacing="xs"
          >
            <thead>
              <tr className="text-center bg-gray-100">
                <th>#</th>
                <th>Mã BN</th>
                <th>Họ tên</th>
                <th>Điện thoại</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>CCCD</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="text-center">
                  <td>
                    <input
                      type="radio"
                      name="selectPatient"
                      checked={selected?.id === patient.id}
                      onChange={() => onSelect(patient)}
                    />
                  </td>
                  <td>{patient.maBN}</td>
                  <td>{patient.name}</td>
                  <td>{patient.phone}</td>
                  <td>
                    {new Date(patient.dob || "").toString() === "Invalid Date"
                      ? "-"
                      : new Date(patient.dob).toLocaleDateString("vi-VN")}
                  </td>

                  <td>{patient.gender}</td>
                  <td>{patient.account || "-"}</td>
                  <td>{patient.email || "-"}</td>
                  <td>{patient.cccd || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>

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
