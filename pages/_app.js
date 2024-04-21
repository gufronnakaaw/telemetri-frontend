import '@/styles/globals.css';

import { ThemeProvider } from '@material-tailwind/react';
import { SessionProvider, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  useEffect(() => {
    window.onfocus = async () => {
      if (!router.asPath.startsWith('/auth')) {
        const session = await getSession();

        if (!session) {
          signOut();
        }
      }
    };
  }, [router]);
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ThemeProvider>
        <NextNProgress color="#2e2e2e" />
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
