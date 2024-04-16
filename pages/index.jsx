import Layout from '@/components/Layout';
import { Card } from '@material-tailwind/react';
import dynamic from 'next/dynamic';

const Maps = dynamic(() => import('@/components/Maps'), {
  ssr: false,
});

export default function Home() {
  return (
    <Layout title="Dashboard">
      <Card className="h-full w-full p-3 rounded-md">
        <Maps />
      </Card>
    </Layout>
  );
}
