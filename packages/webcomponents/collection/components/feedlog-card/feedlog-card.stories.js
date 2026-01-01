import { h } from '@stencil/core';
import { FeedlogCard } from './feedlog-card';
const meta = {
  title: 'Components/Card',
  component: FeedlogCard,
  parameters: {
    layout: 'centered',
  },
};
export default meta;
export const Default = {
  render: () =>
    h(
      'feedlog-card',
      { style: { width: '400px' } },
      h('div', { slot: 'header' }, h('h3', { style: { margin: '0 0 0.5rem 0' } }, 'Card Title')),
      h(
        'div',
        { slot: 'content' },
        h(
          'p',
          { style: { margin: '0', color: '#666' } },
          'This is the card content. You can put any content here.'
        )
      )
    ),
};
export const WithFooter = {
  render: () =>
    h(
      'feedlog-card',
      { style: { width: '400px' } },
      h(
        'div',
        { slot: 'header' },
        h('h3', { style: { margin: '0 0 0.5rem 0' } }, 'Card with Footer')
      ),
      h(
        'div',
        { slot: 'content' },
        h(
          'p',
          { style: { margin: '0', color: '#666' } },
          'This card has a header, content, and footer section.'
        )
      ),
      h(
        'div',
        { slot: 'footer', style: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' } },
        h('feedlog-button', { variant: 'ghost' }, 'Cancel'),
        h('feedlog-button', null, 'Save')
      )
    ),
};
export const HeaderOnly = {
  render: () =>
    h(
      'feedlog-card',
      { style: { width: '400px' } },
      h(
        'div',
        { slot: 'header' },
        h('h3', { style: { margin: '0' } }, 'Simple Header Card'),
        h(
          'p',
          { style: { margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.875rem' } },
          'This card only uses the header slot.'
        )
      )
    ),
};
export const IssueCard = {
  render: () =>
    h(
      'feedlog-card',
      { style: { width: '500px' } },
      h(
        'div',
        { slot: 'header', style: { display: 'flex', alignItems: 'flex-start', gap: '1rem' } },
        h('feedlog-button', { variant: 'outline', size: 'sm' }, '\uD83D\uDC4D 12'),
        h(
          'div',
          null,
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
              },
            },
            h('h3', { style: { margin: '0' } }, 'Add dark mode support'),
            h('feedlog-badge', null, 'Enhancement')
          ),
          h(
            'p',
            { style: { margin: '0', color: '#666', fontSize: '0.875rem' } },
            'It would be great to have a dark mode option for the dashboard.'
          )
        )
      )
    ),
};
//# sourceMappingURL=feedlog-card.stories.js.map
