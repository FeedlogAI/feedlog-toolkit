import { h } from '@stencil/core';
import { FeedlogButton } from './feedlog-button';
const meta = {
  title: 'Components/Button',
  component: FeedlogButton,
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
export const Default = {
  args: {
    variant: 'default',
  },
  render: props => h('feedlog-button', Object.assign({}, props), 'Click me'),
};
export const Outline = {
  args: {
    variant: 'outline',
  },
  render: props => h('feedlog-button', Object.assign({}, props), 'Outline Button'),
};
export const Ghost = {
  args: {
    variant: 'ghost',
  },
  render: props => h('feedlog-button', Object.assign({}, props), 'Ghost Button'),
};
export const Destructive = {
  args: {
    variant: 'destructive',
  },
  render: props => h('feedlog-button', Object.assign({}, props), 'Delete'),
};
export const Small = {
  args: {
    size: 'sm',
  },
  render: props => h('feedlog-button', Object.assign({}, props), 'Small Button'),
};
export const Large = {
  args: {
    size: 'lg',
  },
  render: props => h('feedlog-button', Object.assign({}, props), 'Large Button'),
};
export const Disabled = {
  args: {
    disabled: true,
  },
  render: props => h('feedlog-button', Object.assign({}, props), 'Disabled'),
};
export const AllVariants = {
  render: () =>
    h(
      'div',
      { style: { display: 'flex', gap: '1rem', flexWrap: 'wrap' } },
      h('feedlog-button', { variant: 'default' }, 'Default'),
      h('feedlog-button', { variant: 'outline' }, 'Outline'),
      h('feedlog-button', { variant: 'ghost' }, 'Ghost'),
      h('feedlog-button', { variant: 'destructive' }, 'Destructive')
    ),
};
//# sourceMappingURL=feedlog-button.stories.js.map
