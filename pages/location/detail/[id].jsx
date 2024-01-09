import Chart from '@/components/Chart';
import Layout from '@/components/Layout';
import { Button, Card } from '@material-tailwind/react';
import { useRouter } from 'next/router';

export default function DetailLocation() {
  const router = useRouter();

  return (
    <Layout title="Detail Location">
      <Card className="h-full w-full rounded-lg p-5">
        <div>
          <Button onClick={() => router.push('/location/detail')}>Back</Button>
        </div>
        <Chart />
      </Card>
    </Layout>
  );
}
