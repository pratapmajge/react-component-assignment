import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, Column } from "../components/DataTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: Column<User>[] = [
  { key: "id", title: "ID", dataIndex: "id", sortable: true },
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "email", title: "Email", dataIndex: "email" },
  { key: "role", title: "Role", dataIndex: "role", sortable: true },
];

const mockData: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Editor" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "Viewer" },
  { id: 4, name: "David", email: "david@example.com", role: "Admin" },
];

const meta: Meta<typeof DataTable<User>> = {
  title: "Components/DataTable",
  component: DataTable<User>,
};
export default meta;

type Story = StoryObj<typeof DataTable<User>>;

export const Default: Story = {
  args: {
    data: mockData,
    columns,
  },
};

export const Sortable: Story = {
  args: {
    data: mockData,
    columns,
  },
};

export const Selectable: Story = {
  args: {
    data: mockData,
    columns,
    selectable: true,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
  },
};
