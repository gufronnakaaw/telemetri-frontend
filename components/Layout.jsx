import Head from 'next/head';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="mx-auto flex h-screen overflow-hidden bg-white dark:bg-blue-gray-900">
        <Sidebar />
        <div className={`flex w-full flex-1 flex-col`}>
          <Navbar />
          <main className="h-full overflow-y-auto p-6 scrollbar-hide">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
