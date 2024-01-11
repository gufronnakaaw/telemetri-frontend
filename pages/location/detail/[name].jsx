import Layout from '@/components/Layout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Button, Card, Spinner, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const TABLE_HEAD = [
  'Time',
  'AC Voltage',
  'AC Current',
  'Power',
  'Energy',
  'Frequency',
  'PF',
  'DC Voltage',
  'DC Current',
  'Suhu',
  'Kelembapan Air',
  'Water Flow',
  'Ketinggian Air',
  'Volume Air',
];
export default function DetailLocation({ details, token, name }) {
  const { data, isLoading } = useSWR(
    `/api/location/detail/${name}`,
    async (url) => {
      try {
        const { data } = await axios.get(`http://103.112.163.137:3001${url}`, {
          headers: {
            token,
          },
        });

        return data;
      } catch (error) {
        return error;
      }
    },
    {
      fallback: details,
      refreshInterval: 10000,
    }
  );

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Layout title="Detail Location">
      <Card className="h-full w-full rounded-lg p-5 overflow-scroll overflow-y-hidden">
        <div>
          <Button onClick={() => router.push('/location/detail')}>Back</Button>
        </div>

        <table className="mt-4 w-full min-w-max table-auto text-center">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 "
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-center gap-2 font-normal leading-none opacity-70 "
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.data.map((detail, index) => {
              const classes = 'p-4 border-b border-blue-gray-50';

              return (
                <tr key={detail.id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.time}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.ac_voltage}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.ac_current}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.power}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.energy}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.frequency}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.pf}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.dc_voltage}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.dc_current}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.suhu}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.kelembapan_air}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.water_flow}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.ketinggian_air}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.volume_air}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </Layout>
  );
}

export async function getServerSideProps({ req, res, params }) {
  const session = await getServerSession(req, res, authOptions);

  try {
    const { data } = await axios.get(
      `http://103.112.163.137:3001/api/location/detail/${params.name}`,
      {
        headers: {
          token: session.user.token,
        },
      }
    );

    return {
      props: {
        details: data,
        token: session.user.token,
        name: params.name,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
