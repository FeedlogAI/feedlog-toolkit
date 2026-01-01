import React from 'react';

// Simplified React component creator for web components
export function createComponent(opts: any) {
  const { tagName, events } = opts;

  const Component = React.forwardRef<any, any>((props, ref) => {
    const { children, ...restProps } = props;

    // Convert event handlers
    const eventProps: any = {};
    if (events) {
      Object.entries(events).forEach(([propName, eventName]) => {
        if (props[propName]) {
          eventProps[`on${eventName}`] = props[propName];
        }
      });
    }

    return React.createElement(
      tagName,
      {
        ...restProps,
        ...eventProps,
        ref,
      },
      children
    );
  });

  Component.displayName = tagName;
  return Component;
}