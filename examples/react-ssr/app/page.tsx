import { FeedlogBadge, FeedlogButton, FeedlogCard } from '@feedlog-ai/react/next';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Feedlog React SSR Example</h1>
      <p>Components below are server-side rendered with Stencil SSR:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <FeedlogBadge variant="primary">SSR Badge</FeedlogBadge>
        <FeedlogButton variant="primary" size="md">
          SSR Button
        </FeedlogButton>
        <FeedlogCard>
          <div slot="header">
            <h2>SSR Card</h2>
          </div>
          <div slot="content">
            <p>This card content was rendered on the server.</p>
          </div>
        </FeedlogCard>
      </div>
    </main>
  );
}
