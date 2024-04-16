import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

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

export default function ModalCreate({ open, setOpen, mutate }) {
  const session = useSession();
  const [value, setValue] = useState({});
  const [status, setStatus] = useState('');
  const instrument = [];

  function handleValue(e) {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCreate() {
    if (instrument.length == 0) {
      return alert('instrument is required!');
    }

    try {
      await axios.post(
        'http://103.112.163.137:3001/api/location',
        {
          ...value,
          status,
          instrument,
        },
        {
          headers: {
            token: session.data.user.token,
          },
        }
      );
      setOpen(!open);
      mutate();
      session.update();
    } catch (error) {
      console.log(error);
    }
  }

  function handleInstrument(e) {
    const index = instrument.findIndex(
      (element) => element.field == e.target.dataset.field
    );

    if (index == -1) {
      instrument.push({
        name: e.target.dataset.name,
        field: e.target.dataset.field,
        checked: e.target.checked,
      });
    } else {
      instrument.splice(index, 1);
    }
  }

  return (
    <>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader className="font-inter">Create Location</DialogHeader>
        <DialogBody className="flex flex-col gap-3">
          <div className="flex gap-2 font-inter">
            <Input
              autoComplete="off"
              label="Name"
              name="name"
              onChange={handleValue}
              placeholder="example: D1030"
            />
            <Input
              autoComplete="off"
              label="Title"
              name="title"
              onChange={handleValue}
              placeholder="example: Testing Station"
            />
          </div>
          <div className="flex gap-2 font-inter">
            <Input
              autoComplete="off"
              label="Latitude"
              name="lat"
              onChange={handleValue}
            />
            <Input
              autoComplete="off"
              label="Longitude"
              name="long"
              onChange={handleValue}
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
              {HEAD.map((element, index) => {
                return (
                  <Checkbox
                    label={element.name}
                    defaultChecked={false}
                    data-name={element.name}
                    data-field={element.field}
                    key={index}
                    onClick={handleInstrument}
                  />
                );
              })}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpen(!open)}
            className="mr-1 font-inter capitalize"
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} className="capitalize font-inter">
            Create
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
