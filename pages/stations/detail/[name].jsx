import Layout from '@/components/Layout';
import Loading from '@/components/Spinner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { convertDate, convertTime } from '@/utils/convert';
import { Card, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import Toast from 'react-hot-toast';
import useSWR from 'swr';

export default function DetailStations({ details, token, name }) {
  const { data, isLoading, isValidating } = useSWR(
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
      refreshInterval: 1000 * 60, // 1 minute
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!isValidating) {
    Toast.success('Successfully updated data', {
      position: 'top-right',
      duration: 3500,
    });
  }

  return (
    <Layout title={`Detail Station ${data.data.title}`}>
      <Card className="h-full w-full rounded-lg p-5">
        <Typography variant="h5">Station : {data.data.title}</Typography>
        <Typography variant="h5">Status : {data.data.status}</Typography>

        <div className="overflow-scroll rounded-sm mt-5">
          <table className="w-full min-w-max table-auto text-center">
            <thead>
              <tr>
                {['Date', 'Time', ...data.data.instrument].map(
                  (head, index) => (
                    <th
                      key={index}
                      className="cursor-pointer p-6 hover:bg-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-center gap-2 leading-none font-bold"
                      >
                        {typeof head == 'string' ? head : head.name}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data.data.telemetry.length == 0 ? (
                <tr>
                  <td colSpan={14}>Data Kosong</td>
                </tr>
              ) : (
                data.data.telemetry.map((detail) => {
                  const classes = 'p-6 border-b border-blue-gray-50';

                  return (
                    <tr key={detail.id} className="odd:bg-gray-200">
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {convertDate(detail.created_at)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {convertTime(detail.created_at)}
                        </Typography>
                      </td>

                      {data.data.instrument.map((element, index) => {
                        return (
                          <td className={classes} key={index}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {detail[element.field]}
                            </Typography>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
