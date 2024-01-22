import '@/styles/globals.css';

import { ThemeProvider } from '@material-tailwind/react';
import { SessionProvider, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from 'react';
import Toast, { Toaster } from 'react-hot-toast';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  useEffect(() => {
    window.onfocus = async () => {
      const session = await getSession();

      if (router.asPath !== '/auth/login') {
        if (!session) {
          Toast.error('session expired', {
            position: 'top-right',
            duration: 1000,
          });
          signOut();
        }
      }
    };
  }, [router]);
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ThemeProvider>
        <NextNProgress color="#16a34a" />
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
