import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import { FeedlogBadge } from './feedlog-badge';

const meta: Meta<FeedlogBadge> = {
  title: 'Components/Badge',
  component: FeedlogBadge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Badge variant style',
    },
  },
  args: {
    variant: 'default',
  },
};

export default meta;

type Story = StoryObj<FeedlogBadge>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: props => <feedlog-badge {...props}>Enhancement</feedlog-badge>,
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: props => <feedlog-badge {...props}>Bug</feedlog-badge>,
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <feedlog-badge variant="default">Default</feedlog-badge>
      <feedlog-badge variant="destructive">Destructive</feedlog-badge>
    </div>
  ),
};

export const Labels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <feedlog-badge>New</feedlog-badge>
      <feedlog-badge>Feature</feedlog-badge>
      <feedlog-badge>Enhancement</feedlog-badge>
      <feedlog-badge variant="destructive">Bug</feedlog-badge>
      <feedlog-badge variant="destructive">Critical</feedlog-badge>
    </div>
  ),
};
