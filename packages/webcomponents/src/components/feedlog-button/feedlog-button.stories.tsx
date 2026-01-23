import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';

const meta: Meta = {
  title: 'Components/Button',
  component: 'feedlog-button',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button type',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
    type: 'button',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: props => <feedlog-button {...props}>Click me</feedlog-button>,
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  render: props => <feedlog-button {...props}>Outline Button</feedlog-button>,
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
  render: props => <feedlog-button {...props}>Ghost Button</feedlog-button>,
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: props => <feedlog-button {...props}>Delete</feedlog-button>,
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: props => <feedlog-button {...props}>Small Button</feedlog-button>,
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: props => <feedlog-button {...props}>Large Button</feedlog-button>,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: props => <feedlog-button {...props}>Disabled</feedlog-button>,
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <feedlog-button variant="default">Default</feedlog-button>
      <feedlog-button variant="outline">Outline</feedlog-button>
      <feedlog-button variant="ghost">Ghost</feedlog-button>
      <feedlog-button variant="destructive">Destructive</feedlog-button>
    </div>
  ),
};
