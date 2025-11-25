import { h } from "@stencil/core";
import { FeedlogGithubIssues } from "./feedlog-github-issues";
const sampleIssues = [
    {
        id: 1,
        title: 'Add dark mode support',
        body: 'It would be great to have a dark mode option for the dashboard.',
        type: 'enhancement',
        upvotes: 24,
    },
    {
        id: 2,
        title: 'Charts not rendering on mobile',
        body: 'The chart components are not properly responsive on smaller screens.',
        type: 'bug',
    },
    {
        id: 3,
        title: 'Export data to CSV',
        body: 'Add functionality to export chart data as CSV files.',
        type: 'enhancement',
        upvotes: 15,
    },
    {
        id: 4,
        title: 'Memory leak in real-time updates',
        body: 'When leaving the dashboard open for extended periods, memory usage increases significantly.',
        type: 'bug',
    },
    {
        id: 5,
        title: 'Custom color themes',
        body: 'Allow users to customize the color palette for charts and UI elements.',
        type: 'enhancement',
        upvotes: 8,
    },
];
const meta = {
    title: 'Components/GitHub Issues',
    component: FeedlogGithubIssues,
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        data: {
            control: 'object',
            description: 'Issues data as JSON string or array',
        },
        maxWidth: {
            control: 'text',
            description: 'Maximum width of the container',
        },
    },
    args: {
        data: JSON.stringify(sampleIssues),
        maxWidth: '56rem',
    },
};
export default meta;
export const Default = {
    args: {
        data: JSON.stringify(sampleIssues),
    },
    render: props => h("feedlog-github-issues", Object.assign({}, props)),
};
export const EnhancementsOnly = {
    args: {
        data: JSON.stringify(sampleIssues.filter(issue => issue.type === 'enhancement')),
    },
    render: props => h("feedlog-github-issues", Object.assign({}, props)),
};
export const BugsOnly = {
    args: {
        data: JSON.stringify(sampleIssues.filter(issue => issue.type === 'bug')),
    },
    render: props => h("feedlog-github-issues", Object.assign({}, props)),
};
export const EmptyState = {
    args: {
        data: JSON.stringify([]),
    },
    render: props => h("feedlog-github-issues", Object.assign({}, props)),
};
export const NarrowWidth = {
    args: {
        data: JSON.stringify(sampleIssues.slice(0, 3)),
        maxWidth: '32rem',
    },
    render: props => h("feedlog-github-issues", Object.assign({}, props)),
};
export const SingleIssue = {
    args: {
        data: JSON.stringify([sampleIssues[0]]),
    },
    render: props => h("feedlog-github-issues", Object.assign({}, props)),
};
//# sourceMappingURL=feedlog-github-issues.stories.js.map
