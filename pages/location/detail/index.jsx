import Layout from '@/components/Layout';
import ModalCreate from '@/components/ModalCreate';
import ModalEdit from '@/components/ModalEdit';
import Loading from '@/components/Spinner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
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
  const [openEdit, setOpenEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const router = useRouter();
  const TABLE_HEAD =
    role == 'admin'
      ? ['#', 'Name', 'Title', 'Status', 'Action']
      : ['#', 'Title', 'Status', 'Action'];

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
            {role == 'admin' ? (
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Tooltip content="Add Location">
                  <IconButton
                    variant="text"
                    onClick={() => setOpenCreate(!openCreate)}
                  >
                    <HiPlus strokeWidth={2} className="h-7 w-7" />
                  </IconButton>
                </Tooltip>
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardBody className="px-0">
          <table className="w-full min-w-max table-auto text-center">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className="cursor-pointer border-b p-6 hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-center gap-2 leading-none font-bold"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((map, index) => {
                const classes = 'p-6 border-b border-blue-gray-50';

                return (
                  <tr key={map.id} className="odd:bg-gray-200">
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}
                      </Typography>
                    </td>
                    {role == 'admin' ? (
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {map.name}
                        </Typography>
                      </td>
                    ) : null}
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
                      {role == 'admin' ? (
                        <>
                          <Tooltip content="Edit Location">
                            <IconButton
                              variant="text"
                              onClick={() => {
                                setDataEdit({
                                  ...map,
                                });
                                setOpenEdit(true);
                              }}
                            >
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
                        </>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {role == 'admin' ? (
        <>
          <ModalCreate
            open={openCreate}
            setOpen={setOpenCreate}
            mutate={mutate}
          />
          <ModalEdit
            open={openEdit}
            setOpen={setOpenEdit}
            mutate={mutate}
            data={dataEdit}
          />
        </>
      ) : null}
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
        role: session.user.role,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
