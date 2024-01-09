import Layout from '@/components/Layout';
import { Card } from '@material-tailwind/react';
import dynamic from 'next/dynamic';

const Maps = dynamic(() => import('@/components/Maps'), {
  ssr: false,
});

export default function LocationMaps() {
  return (
    <Layout title="Location Maps">
      <Card className="h-full w-full rounded-lg">
        <Maps />
      </Card>
    </Layout>
  );
}
