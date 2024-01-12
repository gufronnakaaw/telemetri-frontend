import Layout from '@/components/Layout';
import ModalCreate from '@/components/ModalCreate';
import Loading from '@/components/Spinner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';
import useSWR from 'swr';

const TABLE_HEAD = ['No', 'Name', 'Title', 'Status', 'Action'];
export default function LocationDetail({ stations, token }) {
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
    }
  );
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();

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
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Layout title="Location Detail">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Locations list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all locations
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={() => setOpenCreate(!openCreate)}
              >
                <HiPlus strokeWidth={2} className="h-4 w-4" /> Add location
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0">
          <table className="w-full min-w-max table-auto text-center">
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
              {data.data.map((map, index) => {
                const classes = 'p-4 border-b border-blue-gray-50';

                return (
                  <tr key={map.id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {map.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {map.title}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {map.status}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Detail Location">
                        <IconButton
                          variant="text"
                          onClick={() =>
                            router.push(`/location/detail/${map.name}`)
                          }
                        >
                          <HiExternalLink className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Edit Location">
                        <IconButton variant="text">
                          <HiPencil className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete Location">
                        <IconButton
                          variant="text"
                          onClick={() => handleDelete(map.name)}
                        >
                          <HiTrash className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <ModalCreate open={openCreate} setOpen={setOpenCreate} mutate={mutate} />
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

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
      },
    };
  } catch (error) {
    console.log(error);
  }
}
