import { h } from "@stencil/core";
import { FeedlogBadge } from "./feedlog-badge";
const meta = {
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
export const Default = {
    args: {
        variant: 'default',
    },
    render: props => h("feedlog-badge", Object.assign({}, props), "Enhancement"),
};
export const Destructive = {
    args: {
        variant: 'destructive',
    },
    render: props => h("feedlog-badge", Object.assign({}, props), "Bug"),
};
export const AllVariants = {
    render: () => (h("div", { style: { display: 'flex', gap: '1rem' } }, h("feedlog-badge", { variant: "default" }, "Default"), h("feedlog-badge", { variant: "destructive" }, "Destructive"))),
};
export const Labels = {
    render: () => (h("div", { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' } }, h("feedlog-badge", null, "New"), h("feedlog-badge", null, "Feature"), h("feedlog-badge", null, "Enhancement"), h("feedlog-badge", { variant: "destructive" }, "Bug"), h("feedlog-badge", { variant: "destructive" }, "Critical"))),
};
//# sourceMappingURL=feedlog-badge.stories.js.map
