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
        <div className={`flex flex-1 flex-col w-[1200px]`}>
          <Navbar />
          <main className="h-full overflow-y-auto scrollbar-hide">
            {children}
          </main>
          <p className="text-center font-inter relative bottom-2 text-sm">
            PT. RODA HARAPAN SEMESTA
          </p>
        </div>
      </div>
    </>
  );
}
