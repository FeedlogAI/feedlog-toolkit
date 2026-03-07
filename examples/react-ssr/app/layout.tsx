import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedlog React SSR Example',
  description: 'Next.js app with Feedlog components server-side rendered',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
