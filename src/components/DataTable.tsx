import React, { useState } from "react";

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
}

/**
 * Generic DataTable component with:
 * - Sorting
 * - Row selection
 * - Loading & empty states
 */
export function DataTable<T>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === col.dataIndex && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: col.dataIndex, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const toggleRow = (index: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedRows(newSelection);
    if (onRowSelect) {
      onRowSelect(Array.from(newSelection).map((i) => sortedData[i]));
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available</div>;
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm" role="table">
        <thead className="bg-gray-100">
          <tr>
            {selectable && <th className="p-2"></th>}
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col)}
                className={`p-2 text-left ${col.sortable ? "cursor-pointer select-none" : ""}`}
              >
                {col.title}
                {col.sortable &&
                  sortConfig?.key === col.dataIndex &&
                  (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedData.map((row, i) => (
            <tr
              key={i}
              className={`hover:bg-gray-50 ${selectedRows.has(i) ? "bg-blue-100" : ""}`}
            >
              {selectable && (
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(i)}
                    onChange={() => toggleRow(i)}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className="p-2">
                  {String(row[col.dataIndex])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
