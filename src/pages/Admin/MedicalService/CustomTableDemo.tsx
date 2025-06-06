import React, { useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { Modal } from "../../../components/ui/modal";
import { toast } from "react-toastify";
import DatePicker from "../../../components/form/date-picker";

interface UserProject {
  id: string;
  user: {
    name: string;
    role: string;
    // image removed
  };
  projectName: string;
  team: {
    names: string[];
  };
  status: "Active" | "Pending" | "Inactive";
  budget: string;
}

const CustomTableDemo = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof UserProject | undefined>(
    "projectName"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const tableData: UserProject[] = [
    {
      id: "1",
      user: {
        name: "Alice Johnson",
        role: "Manager",
      },
      projectName: "Project Alpha",
      team: {
        names: ["John", "Mary", "Steve"],
      },
      status: "Active",
      budget: "$12,000",
    },
    {
      id: "2",
      user: {
        name: "Bob Smith",
        role: "Developer",
      },
      projectName: "Project Beta",
      team: {
        names: ["Anna", "Tom"],
      },
      status: "Pending",
      budget: "$8,000",
    },
    {
      id: "3",
      user: {
        name: "Charlie Lee",
        role: "Designer",
      },
      projectName: "Project Gamma",
      team: {
        names: ["Michael", "Laura", "Kevin"],
      },
      status: "Inactive",
      budget: "$5,500",
    },
    {
      id: "4",
      user: {
        name: "Diana Adams",
        role: "QA Engineer",
      },
      projectName: "Project Delta",
      team: {
        names: ["Sarah", "Brian"],
      },
      status: "Active",
      budget: "$10,000",
    },
    {
      id: "5",
      user: {
        name: "Ethan Brown",
        role: "Product Owner",
      },
      projectName: "Project Epsilon",
      team: {
        names: ["David", "Emma", "Olivia"],
      },
      status: "Pending",
      budget: "$9,500",
    },
    {
      id: "1",
      user: {
        name: "Alice Johnson",
        role: "Manager",
      },
      projectName: "Project Alpha",
      team: {
        names: ["John", "Mary", "Steve"],
      },
      status: "Active",
      budget: "$12,000",
    },
    {
      id: "2",
      user: {
        name: "Bob Smith",
        role: "Developer",
      },
      projectName: "Project Beta",
      team: {
        names: ["Anna", "Tom"],
      },
      status: "Pending",
      budget: "$8,000",
    },
    {
      id: "3",
      user: {
        name: "Charlie Lee",
        role: "Designer",
      },
      projectName: "Project Gamma",
      team: {
        names: ["Michael", "Laura", "Kevin"],
      },
      status: "Inactive",
      budget: "$5,500",
    },
    {
      id: "4",
      user: {
        name: "Diana Adams",
        role: "QA Engineer",
      },
      projectName: "Project Delta",
      team: {
        names: ["Sarah", "Brian"],
      },
      status: "Active",
      budget: "$10,000",
    },
    {
      id: "5",
      user: {
        name: "Ethan Brown",
        role: "Product Owner",
      },
      projectName: "Project Epsilon",
      team: {
        names: ["David", "Emma", "Olivia"],
      },
      status: "Pending",
      budget: "$9,500",
    },
    {
      id: "1",
      user: {
        name: "Alice Johnson",
        role: "Manager",
      },
      projectName: "Project Alpha",
      team: {
        names: ["John", "Mary", "Steve"],
      },
      status: "Active",
      budget: "$12,000",
    },
    {
      id: "2",
      user: {
        name: "Bob Smith",
        role: "Developer",
      },
      projectName: "Project Beta",
      team: {
        names: ["Anna", "Tom"],
      },
      status: "Pending",
      budget: "$8,000",
    },
    {
      id: "3",
      user: {
        name: "Charlie Lee",
        role: "Designer",
      },
      projectName: "Project Gamma",
      team: {
        names: ["Michael", "Laura", "Kevin"],
      },
      status: "Inactive",
      budget: "$5,500",
    },
    {
      id: "4",
      user: {
        name: "Diana Adams",
        role: "QA Engineer",
      },
      projectName: "Project Delta",
      team: {
        names: ["Sarah", "Brian"],
      },
      status: "Active",
      budget: "$10,000",
    },
    {
      id: "5",
      user: {
        name: "Ethan Brown",
        role: "Product Owner",
      },
      projectName: "Project Epsilon",
      team: {
        names: ["David", "Emma", "Olivia"],
      },
      status: "Pending",
      budget: "$9,500",
    },
  ];

  const columns = [
    createColumn<UserProject>({
      key: "user",
      label: "User",
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium">{row.user.name}</div>
          <div className="text-xs text-gray-400">{row.user.role}</div>
        </div>
      ),
    }),
    createColumn<UserProject>({
      key: "projectName",
      label: "Project Name",
      sortable: true,
    }),
    createColumn<UserProject>({
      key: "team",
      label: "Team",
      sortable: false, // vì render là array
      render: (row) => <div>{row.team.names.join(", ")}</div>,
    }),
    createColumn<UserProject>({
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : row.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    }),
    createColumn<UserProject>({
      key: "budget",
      label: "Budget",
      sortable: true,
    }),
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Custom Table Demo (No Image)</h1>
        <button
          onClick={() => console.log("Add clicked")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Add
        </button>
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap gap-2 my-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
          onChange={(e) => console.log("Search 1:", e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Status"
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
          onChange={(e) => console.log("Search 2:", e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Project"
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
          onChange={(e) => console.log("Search 3:", e.target.value)}
        />
      </div>
      <CustomTable
        data={tableData}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={tableData.length}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        onSortChange={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onView={(row) => console.log("View", row)}
        onEdit={(row) => console.log("Edit", row)}
        onDelete={(row) => console.log("Delete", row)}
      />
    </>
  );
};

export default CustomTableDemo;
