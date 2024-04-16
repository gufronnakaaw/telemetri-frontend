import Layout from '@/components/Layout';
import ModalCreate from '@/components/ModalCreate';
import Loading from '@/components/Spinner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
  Button,
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
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';
import useSWR from 'swr';

export default function LocationDetail({ stations, token, role }) {
  const { data, isLoading, mutate } = useSWR(
    '/api/location/maps',
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
      fallback: stations,
      revalidateOnFocus: false,
    }
  );
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();
  const session = useSession();
  const TABLE_HEAD = ['#', 'Name', 'Title', 'Status', 'Action'];

  if (isLoading) {
    return <Loading />;
  }

  async function handleDelete(name) {
    if (confirm('are you sure?')) {
      try {
        await axios.delete('http://103.112.163.137:3001/api/location', {
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
              <Button
                onClick={() => setOpenCreate(!openCreate)}
                size="md"
                className="font-inter capitalize font-semibold"
              >
                Create Location
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-2">
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
          <div className="rounded-lg overflow-hidden border border-gray-300 mt-5">
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
                            <button className="cursor-pointer hover:bg-gray-200 transition rounded-sm">
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
      'http://103.112.163.137:3001/api/location/maps',
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
