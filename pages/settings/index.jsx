import Layout from '@/components/Layout';
import ModalCreate from '@/components/ModalCreate';
import Loading from '@/components/Spinner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
  Card,
  CardBody,
  CardHeader,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';
import useSWR from 'swr';

export default function LocationDetail({ stations, token }) {
  const { data, isLoading, mutate } = useSWR(
    '/api/location/maps',
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
      fallback: stations,
      revalidateOnFocus: false,
    }
  );
  const [openCreate, setOpenCreate] = useState(false);
  const session = useSession();
  const TABLE_HEAD = ['#', 'Name', 'Title', 'Status', 'Action'];

  if (isLoading) {
    return <Loading />;
  }

  async function handleDelete(name) {
    if (confirm('are you sure?')) {
      try {
        await axios.delete('http://iotindonesia.online:1414/api/location', {
          headers: {
            token,
          },
          data: { name },
        });
        mutate();
        session.update();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Layout title="Settings">
      <Card className="h-full w-full rounded-none">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="blue-gray" className="font-inter">
                Locations
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col sm:flex-row">
              <button
                className="capitalize flex justify-center items-center border border-gray-400 text-custom-gray-two gap-2 px-4 py-2 rounded-md font-inter text-sm font-bold bg-custom-gray-one"
                onClick={() => setOpenCreate(!openCreate)}
              >
                Add New
              </button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-2">
          <div className="rounded-lg overflow-hidden border border-gray-300">
            <table className="w-full min-w-max table-auto text-center">
              <thead className="rounded-2xl">
                <tr>
                  {TABLE_HEAD.map((head, index) => (
                    <th key={index} className="p-4 bg-custom-gray-two">
                      <Typography
                        variant="small"
                        className="flex items-center justify-center gap-2 leading-none font-semibold font-inter text-custom-gray-one"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.map((map, index) => {
                  const classes = 'border-b p-2';

                  return (
                    <tr key={map.id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal font-inter"
                        >
                          {index + 1}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal font-inter"
                        >
                          {map.name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal font-inter"
                        >
                          {map.title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal font-inter"
                        >
                          {map.status}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Menu>
                          <MenuHandler>
                            <button className="cursor-pointer hover:bg-gray-300 transition rounded-md">
                              <HiEllipsisVertical className="w-5 h-5" />
                            </button>
                          </MenuHandler>
                          <MenuList>
                            <Link href={`/stations/detail/${map.name}`}>
                              <MenuItem>Detail</MenuItem>
                            </Link>
                            <Link href={`/settings/edit/stations/${map.name}`}>
                              <MenuItem>Edit</MenuItem>
                            </Link>
                            <MenuItem onClick={() => handleDelete(map.name)}>
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      <ModalCreate open={openCreate} setOpen={setOpenCreate} mutate={mutate} />
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  try {
    const { data } = await axios.get(
      'http://iotindonesia.online:1414/api/location/maps',
      {
        headers: {
          token: session.user.token,
        },
      }
    );

    return {
      props: {
        stations: data,
        token: session.user.token,
        role: session.user.role,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
