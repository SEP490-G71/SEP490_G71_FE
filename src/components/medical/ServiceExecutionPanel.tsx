import { Title } from "@mantine/core";
import ServiceTableSection from "../common/ServiceTableSection";
import { MedicalRecordOrder } from "../../types/MedicalRecord/MedicalRecordDetail";

interface Props {
  pendingServices: MedicalRecordOrder[];
  doneServices?: MedicalRecordOrder[];
  onAction?: (item: MedicalRecordOrder) => void;
}

const ServiceExecutionPanel = ({
  pendingServices,
  doneServices = [],
  onAction,
}: Props) => {
  const mappedDoneServices = doneServices.map((order, _) => ({
    ...order,
    completedBy: order.results?.[0]?.completedBy ?? order.createdBy,
  }));

  return (
    <>
      <div className="mb-6">
        <Title order={5} mb="xs" c="orange">
          DỊCH VỤ CHỜ LÀM
        </Title>
        <ServiceTableSection
          type="pending"
          headers={["#", "Tên dịch vụ", "Người tạo", "Thao tác"]}
          data={pendingServices}
          onAction={onAction}
          centeredColumns={[0, 3]}
        />
      </div>

      <div>
        <Title order={5} mb="xs" c="blue">
          DỊCH VỤ ĐÃ LÀM
        </Title>
        <ServiceTableSection
          type="done"
          headers={["#", "Tên dịch vụ", "Người khám", "Thao tác"]}
          data={mappedDoneServices}
          onAction={onAction}
          centeredColumns={[0, 3]}
        />
      </div>
    </>
  );
};

export default ServiceExecutionPanel;
