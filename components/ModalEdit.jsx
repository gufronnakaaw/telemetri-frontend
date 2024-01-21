import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
} from '@material-tailwind/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ModalEdit({
  open,
  setOpen,
  mutate,
  data,
  setDataEdit,
}) {
  const session = useSession();
  const [value, setValue] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    setValue({ ...data });
    setStatus(data.status);
  }, [data]);

  function handleValue(e) {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCreate() {
    try {
      await axios.patch(
        'http://103.112.163.137:3001/api/location',
        {
          ...value,
          status,
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

  return (
    <>
      <Dialog
        open={open}
        handler={() => {
          setValue({});
          setOpen(!open);
        }}
      >
        <DialogHeader>Update Location</DialogHeader>
        <DialogBody className="flex flex-col gap-3">
          <div className="flex gap-2">
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
          <div className="flex gap-2">
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
          <div className="flex gap-2">
            <Select label="Status" onChange={(e) => setStatus(e)}>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setValue({});
              setDataEdit({});
              setOpen(!open);
            }}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="black" onClick={handleCreate}>
            <span>Update</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
