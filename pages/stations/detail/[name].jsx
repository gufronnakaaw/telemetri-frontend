import Layout from '@/components/Layout';
import Loading from '@/components/Spinner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { convertDate, convertTime } from '@/utils/convert';
import {
  Button,
  Card,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
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
        <Typography variant="h6" className="font-inter">
          Station : {data.data.title}
        </Typography>
        <Typography variant="h6" className="font-inter">
          Status : {data.data.status}
        </Typography>

        <div className="flex justify-end gap-2">
          <Menu>
            <MenuHandler>
              <Button className="bg-custom-gray-one capitalize" size="sm">
                Filter
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem>By Date</MenuItem>
              <MenuItem>By Time</MenuItem>
            </MenuList>
          </Menu>
          <Link href="/telemetri.xlsx" download>
            <Button className="bg-custom-gray-one capitalize" size="sm">
              Export
            </Button>
          </Link>
        </div>

        <div className="overflow-scroll rounded-lg border border-gray-300 mt-5">
          <table className="w-full min-w-max table-auto text-center">
            <thead>
              <tr>
                {['Date', 'Time', ...data.data.instrument].map(
                  (head, index) => (
                    <th key={index} className="p-4 bg-custom-gray-two">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-center gap-2 leading-none font-semibold font-inter"
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
                  const classes = 'border-b p-2 ';

                  return (
                    <tr key={detail.id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal font-inter"
                        >
                          {convertDate(detail.created_at)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal font-inter"
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
                              className="font-normal font-inter"
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
