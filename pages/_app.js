import '@/styles/globals.css';

import { ThemeProvider } from '@material-tailwind/react';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <NextNProgress color="#16a34a" />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
