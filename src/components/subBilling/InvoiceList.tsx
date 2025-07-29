//import dayjs from "dayjs";
import { InvoiceStatusMap } from "../../enums/InvoiceStatus/InvoiceStatus";
import CustomTable from "../common/CustomTable";

interface Props {
  invoices: any[];
  loading: boolean;
  selectedInvoiceInfo: { id: string; status: string } | null;
  onSelectInvoice: (id: string) => void;
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  pagination: { totalPages: number };
}

const InvoiceList = ({
  invoices,
  loading,
  selectedInvoiceInfo,
  onSelectInvoice,
  page,
  pageSize,
  setPage,
  setPageSize,
  pagination,
}: Props) => {
  const columns = [
    {
      key: "status",
      label: "Trạng thái",

      render: (row: any) =>
        InvoiceStatusMap[row.status as keyof typeof InvoiceStatusMap] ??
        row.status,
    },
    {
      key: "invoiceCode",
      label: "Mã hóa đơn",
    },
    {
      key: "patientName",
      label: "Tên bệnh nhân",
    },
    // {
    //   key: "createdAt",
    //   label: "Ngày tạo",
    //   render: (row: any) =>
    //     row.createdAt ? dayjs(row.createdAt).format("DD/MM/YYYY") : "",
    // },
  ];

  return (
    <div>
      <CustomTable
        data={invoices}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={pagination.totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={loading}
        onRowClick={(row) => onSelectInvoice(row.invoiceId)}
        getRowStyle={(row) =>
          selectedInvoiceInfo?.id === row.invoiceId
            ? { backgroundColor: "#cce5ff" }
            : {}
        }
        emptyText="Không có hóa đơn chưa thanh toán"
        showActions={false}
      />
    </div>
  );
};

export default InvoiceList;
