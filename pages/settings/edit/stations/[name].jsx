import Layout from '@/components/Layout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
  Button,
  Card,
  Checkbox,
  IconButton,
  Input,
  Option,
  Select,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Toast from 'react-hot-toast';
import { HiArrowLeft } from 'react-icons/hi2';

const HEAD = [
  {
    name: 'AC Voltage',
    field: 'ac_voltage',
  },
  {
    name: 'AC Current',
    field: 'ac_current',
  },
  {
    name: 'Power',
    field: 'power',
  },
  {
    name: 'Energy',
    field: 'energy',
  },
  {
    name: 'Frequency',
    field: 'frequency',
  },
  {
    name: 'Power Factor',
    field: 'pf',
  },
  {
    name: 'DC Voltage',
    field: 'dc_voltage',
  },
  {
    name: 'DC Current',
    field: 'dc_current',
  },
  {
    name: 'Suhu',
    field: 'suhu',
  },
  {
    name: 'Kelembapan Air',
    field: 'kelembapan_air',
  },
  {
    name: 'Water Flow',
    field: 'water_flow',
  },
  {
    name: 'Ketinggian Air',
    field: 'ketinggian_air',
  },
  {
    name: 'Volume Air',
    field: 'volume_air',
  },
];

export default function StationEdit({ station, token }) {
  const { instrument, status: statusProp, ...all } = station;
  const [value, setValue] = useState(all);
  const [status, setStatus] = useState(statusProp);

  const updateInstrument = [...instrument[0].data];
  const router = useRouter();

  function handleValue(e) {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpdate() {
    if (updateInstrument.length == 0) {
      return alert('instrument is required!');
    }

    try {
      await axios.patch(
        'http://103.112.163.137:3001/api/location',
        {
          ...value,
          status,
          instrument: updateInstrument,
        },
        {
          headers: {
            token,
          },
        }
      );

      Toast.success('the station has been updated', {
        position: 'top-right',
      });
      router.push('/settings');
    } catch (error) {
      console.log(error);
    }
  }

  function handleInstrument(e) {
    const { name, field } = e.target.dataset;

    const findIndex = updateInstrument.findIndex(
      (element) => element.field == field
    );

    if (findIndex == -1) {
      updateInstrument.push({
        name: name,
        field: field,
      });
    } else {
      updateInstrument.splice(findIndex, 1);
    }
  }
  return (
    <Layout title="Edit Station">
      <Card className="h-full w-full p-5">
        <div className="mb-5">
          <Tooltip content="Back">
            <IconButton variant="text" onClick={() => router.push('/settings')}>
              <HiArrowLeft className="h-6 w-6" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-3 ">
          <Typography variant="h3" className="font-inter">
            Edit Station
          </Typography>
          <div className="flex gap-2 font-inter">
            <Input
              autoComplete="off"
              label="Name"
              name="name"
              onChange={handleValue}
              placeholder="example: D1030"
              defaultValue={value.name}
            />
            <Input
              autoComplete="off"
              label="Title"
              name="title"
              onChange={handleValue}
              placeholder="example: Testing Station"
              defaultValue={value.title}
            />
          </div>
          <div className="flex gap-2 font-inter">
            <Input
              autoComplete="off"
              label="Latitude"
              name="lat"
              onChange={handleValue}
              defaultValue={value.lat}
            />
            <Input
              autoComplete="off"
              label="Longitude"
              name="long"
              onChange={handleValue}
              defaultValue={value.long}
            />
          </div>
          <div className="flex gap-2 font-inter">
            <Select label="Status" onChange={(e) => setStatus(e)}>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
          <div className="flex gap-2 flex-col font-inter">
            <Typography>Instrument</Typography>
            <div className="grid grid-cols-3">
              {HEAD.map((element) => {
                const listChecked = instrument[0].data.findIndex(
                  (el) => element.field == el.field
                );

                return (
                  <Checkbox
                    label={element.name}
                    defaultChecked={listChecked != -1}
                    data-name={element.name}
                    data-field={element.field}
                    key={element.name}
                    onClick={handleInstrument}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <Button className="font-inter capitalize" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
}

export async function getServerSideProps({ req, res, params }) {
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
        station: data.data.filter((element) => element.name == params.name)[0],
        token: session.user.token,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
