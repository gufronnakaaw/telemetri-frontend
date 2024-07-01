import Layout from '@/components/Layout';
import Loading from '@/components/Spinner';
import StatusBadge from '@/components/StatusBadge';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { convertDate, convertTime } from '@/utils/convert';
import {
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
import { useRouter } from 'next/router';
import Toast from 'react-hot-toast';
import { HiChevronDown } from 'react-icons/hi2';
import useSWR from 'swr';
import * as xlsx from 'xlsx';

export default function DetailStations({ details, token, name }) {
  const { query } = useRouter();

  const filterUrl = query.period
    ? `/api/location/detail/${name}?period=12h`
    : `/api/location/detail/${name}`;

  const { data, isLoading, isValidating } = useSWR(
    filterUrl,
    async (url) => {
      try {
        const { data } = await axios.get(
          `http://iotindonesia.online:1414${url}`,
          {
            headers: {
              token,
            },
          }
        );

        return data;
      } catch (error) {
        return error;
      }
    },
    {
      fallback: details,
      refreshInterval: 1000 * 60, // 1 minute,
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!isValidating) {
    Toast.success('Successfully updated data', {
      position: 'bottom-right',
      duration: 3500,
    });
  }

  async function handleExport() {
    try {
      const { data: response } = await axios.get(
        `http://iotindonesia.online:1414/api/location/detail/${name}?period=12h`,
        {
          headers: {
            token,
          },
        }
      );

      const { data } = response;

      const telemetry = data.telemetry.map((detail, index) => {
        const result = {
          No: index + 1,
          Date: convertDate(detail.created_at),
          Time: convertTime(detail.created_at),
        };

        for (let instrument of data.instrument) {
          Object.assign(result, {
            [instrument.name]: detail[instrument.field],
          });
        }

        return result;
      });

      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(telemetry);

      xlsx.utils.book_append_sheet(workbook, worksheet, 'Testing');
      xlsx.writeFile(workbook, 'testing.xlsx');
    } catch (error) {
      console.log(error);
      alert('cannot export data!');
    }
  }

  return (
    <Layout title={`Detail Station ${data.data.title}`}>
      <Card className="h-full w-full rounded-lg p-5">
        <div className="flex justify-between">
          <div>
            <table className="font-inter text-custom-gray-one font-semibold capitalize">
              <tbody>
                <tr>
                  <td>Station</td>
                  <td>: {data.data.title}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    : <StatusBadge text={data.data.status} />
                  </td>
                </tr>
                {query.period ? (
                  <tr>
                    <td>Period</td>
                    <td>: {query.period == '12h' ? '12 Hours' : null}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className="flex items-end gap-2 justify-center">
            <Menu>
              <MenuHandler>
                <button className="capitalize flex justify-center items-center border border-gray-400 text-custom-gray-one gap-2 px-4 py-2 rounded-md font-inter text-sm font-bold">
                  Filter <HiChevronDown />
                </button>
              </MenuHandler>
              <MenuList>
                <Link href={`/stations/detail/${name}?period=12h`}>
                  <MenuItem>Last 12 Hours</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <button
              className="capitalize flex justify-center items-center border border-gray-400 text-custom-gray-two gap-2 px-4 py-2 rounded-md font-inter text-sm font-bold bg-custom-gray-one"
              onClick={handleExport}
            >
              Export
            </button>
          </div>
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
                          className={`${
                            query.period ? 'font-bold' : 'font-normal'
                          } font-inter`}
                        >
                          {convertDate(detail.created_at)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`${
                            query.period ? 'font-bold' : 'font-normal'
                          } font-inter`}
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
      `http://iotindonesia.online:1414/api/location/detail/${params.name}`,
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
