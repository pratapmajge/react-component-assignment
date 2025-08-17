import type { Meta, StoryObj } from "@storybook/react";
import InputField from "../components/InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  args: {
    label: "Username",
    placeholder: "Enter text...",
    variant: "outlined",
    size: "md",
  },
  argTypes: {
    variant: { control: "radio", options: ["outlined", "filled", "ghost"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof InputField>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    variant: "filled",
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    label: "Ghost Input",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    label: "Password",
    placeholder: "Enter password",
  },
};

export const Invalid: Story = {
  args: {
    label: "Email",
    placeholder: "bad-email",
    invalid: true,
    errorMessage: "This email is not valid",
  },
};

export const WithHelper: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    helperText: "We’ll never share your email.",
  },
};

export const Loading: Story = {
  args: {
    label: "Loading",
    isLoading: true,
  },
};

export const Clearable: Story = {
  args: {
    label: "Search",
    clearable: true,
    defaultValue: "Pre-filled",
  },
};
