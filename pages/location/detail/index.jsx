import Layout from '@/components/Layout';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { HiExternalLink } from 'react-icons/hi';
import { HiMagnifyingGlass, HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';

const TABLE_HEAD = ['No', 'Name', 'Status', 'Action'];

export default function LocationDetail({ maps }) {
  const router = useRouter();
  return (
    <Layout title="Location Detail">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Locations list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Locations
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3" size="sm">
                <HiPlus strokeWidth={2} className="h-4 w-4" /> Add location
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<HiMagnifyingGlass className="h-5 w-5" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0">
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
              {maps.map((map, index) => {
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
                        {map.status}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Detail Location">
                        <IconButton
                          variant="text"
                          onClick={() =>
                            router.push(`/location/detail/${map.id}`)
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
                        <IconButton variant="text">
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
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 2
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Previous
            </Button>
            <Button variant="outlined" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const { data } = await axios.get(`http://${req.headers.host}/api/maps`);

    return {
      props: {
        maps: data,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
