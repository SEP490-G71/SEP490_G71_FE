import { useMemo, useState } from "react";
import { Combobox, Input, ScrollArea, useCombobox } from "@mantine/core";

export type ServiceOptionRow = {
  value: string;
  serviceCode: string;
  name: string;
  roomNumber?: string;
  departmentName?: string;
  specializationName?: string;
};

type Props = {
  value: string | null;
  onChange: (v: string | null) => void;
  options: ServiceOptionRow[];
  size?: "xs" | "sm" | "md";
  placeholder?: string;
  disabled?: boolean;
};

const cols = "120px 260px 90px 180px";

export default function ServiceSelectTable({
  value,
  onChange,
  options,
  size = "xs",
  placeholder = "Chọn dịch vụ",
  disabled,
}: Props) {
  const [q, _] = useState("");
  const store = useCombobox({
    onDropdownClose: () => store.resetSelectedOption(),
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) =>
      [
        o.serviceCode,
        o.name,
        o.roomNumber,
        o.departmentName,
        o.specializationName,
      ]
        .filter(Boolean)
        .some((t) => String(t).toLowerCase().includes(s))
    );
  }, [q, options]);

  const selected = value ? options.find((o) => o.value === value) : undefined;

  const cellBase = { padding: "6px 8px", borderRight: "1px solid #E5E7EB" };

  return (
    <Combobox
      store={store}
      onOptionSubmit={(val) => {
        onChange(val);
        store.closeDropdown();
      }}
      withinPortal
    >
      <Combobox.Target>
        <Input
          component="button"
          type="button"
          onClick={() => store.toggleDropdown()}
          disabled={disabled}
          size={size}
          variant="unstyled"
          styles={{ input: { paddingLeft: 0, textAlign: "left" } }}
          title={selected ? `${selected.serviceCode} - ${selected.name}` : ""}
        >
          {selected
            ? `${selected.serviceCode} - ${selected.name}${
                selected.roomNumber ? " - " + selected.roomNumber : ""
              }`
            : placeholder}
        </Input>
      </Combobox.Target>

      <Combobox.Dropdown
        style={{
          zIndex: 10000,
          minWidth: 720,
          border: "1px solid #D1D5DB",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
        p={0}
      >
        {/* <Combobox.Search
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          placeholder="Tìm mã / tên / phòng / khoa"
          style={{ borderBottom: "1px solid #E5E7EB" }}
        /> */}

        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            background: "#F9FAFB",
            borderBottom: "1px solid #E5E7EB",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <div style={cellBase}>Mã DV</div>
          <div style={cellBase}>Tên DV</div>
          <div style={cellBase}>Phòng</div>
          <div style={{ ...cellBase, borderRight: "none" }}>Khoa/Phòng</div>
        </div>

        <ScrollArea.Autosize mah={320} type="auto">
          <Combobox.Options>
            {filtered.map((o) => (
              <Combobox.Option value={o.value} key={o.value} p={0}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: cols,
                    alignItems: "center",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <div style={cellBase}>{o.serviceCode}</div>
                  <div
                    style={{
                      ...cellBase,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={o.name}
                  >
                    {o.name}
                  </div>
                  <div style={cellBase}>{o.roomNumber || ""}</div>
                  <div style={{ ...cellBase, borderRight: "none" }}>
                    {o.departmentName || ""}
                  </div>
                </div>
              </Combobox.Option>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: 12, fontSize: 12, color: "#9aa8c4ff" }}>
                Không có kết quả phù hợp
              </div>
            )}
          </Combobox.Options>
        </ScrollArea.Autosize>
      </Combobox.Dropdown>
    </Combobox>
  );
}
