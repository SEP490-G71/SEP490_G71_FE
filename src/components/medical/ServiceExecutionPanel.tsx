import { Title } from "@mantine/core";
import ServiceTableSection from "../common/ServiceTableSection";

interface ServiceItem {
  code: string;
  name: string;
}

interface Props {
  pendingServices: ServiceItem[];
  doneServices?: ServiceItem[];
  onAction?: (item: ServiceItem) => void;
}

const ServiceExecutionPanel = ({
  pendingServices,
  doneServices = [],
  onAction,
}: Props) => {
  return (
    <>
      <div className="mb-6">
        <Title order={5} mb="xs" c="orange">
          DỊCH VỤ CHỜ LÀM
        </Title>
        <ServiceTableSection
          type="pending"
          headers={["TT", "Mã dịch vụ", "Tên dịch vụ", "Thu tiền", "Thao tác"]}
          data={pendingServices}
          onAction={onAction}
          centeredColumns={[0, 1, 3, 4]}
        />
      </div>

      <div>
        <Title order={5} mb="xs" c="blue">
          DỊCH VỤ ĐÃ LÀM
        </Title>
        <ServiceTableSection
          type="done"
          headers={["TT", "Mã dịch vụ", "Tên dịch vụ", "Thao tác"]}
          data={doneServices}
          centeredColumns={[0, 1, 3]}
        />
      </div>
    </>
  );
};

export default ServiceExecutionPanel;
