import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import { FeedlogCard } from './feedlog-card';

const meta: Meta<FeedlogCard> = {
  title: 'Components/Card',
  component: FeedlogCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<FeedlogCard>;

export const Default: Story = {
  render: () => (
    <feedlog-card style={{ width: '400px' }}>
      <div slot="header">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Card Title</h3>
      </div>
      <div slot="content">
        <p style={{ margin: '0', color: '#666' }}>
          This is the card content. You can put any content here.
        </p>
      </div>
    </feedlog-card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <feedlog-card style={{ width: '400px' }}>
      <div slot="header">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Card with Footer</h3>
      </div>
      <div slot="content">
        <p style={{ margin: '0', color: '#666' }}>
          This card has a header, content, and footer section.
        </p>
      </div>
      <div slot="footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <feedlog-button variant="ghost">Cancel</feedlog-button>
        <feedlog-button>Save</feedlog-button>
      </div>
    </feedlog-card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <feedlog-card style={{ width: '400px' }}>
      <div slot="header">
        <h3 style={{ margin: '0' }}>Simple Header Card</h3>
        <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.875rem' }}>
          This card only uses the header slot.
        </p>
      </div>
    </feedlog-card>
  ),
};

export const IssueCard: Story = {
  render: () => (
    <feedlog-card style={{ width: '500px' }}>
      <div slot="header" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <feedlog-button variant="outline" size="sm">
          👍 12
        </feedlog-button>
        <div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
          >
            <h3 style={{ margin: '0' }}>Add dark mode support</h3>
            <feedlog-badge>Enhancement</feedlog-badge>
          </div>
          <p style={{ margin: '0', color: '#666', fontSize: '0.875rem' }}>
            It would be great to have a dark mode option for the dashboard.
          </p>
        </div>
      </div>
    </feedlog-card>
  ),
};
