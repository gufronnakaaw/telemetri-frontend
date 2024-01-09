import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from '@material-tailwind/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  HiChevronDown,
  HiMap,
  HiMapPin,
  HiMiniArrowRightOnRectangle,
  HiMiniComputerDesktop,
  HiMiniCpuChip,
} from 'react-icons/hi2';

export default function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <>
      <Card className="h-full w-full max-w-[20rem] p-4">
        <div className="mb-2 p-4 text-center">
          <Typography variant="h5" color="blue-gray">
            Telemetri Dashboard
          </Typography>
        </div>
        <List>
          <Accordion
            open={open === 1}
            icon={
              <HiChevronDown
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  open === 1 ? 'rotate-180' : ''
                }`}
              />
            }
          >
            <ListItem onClick={() => router.push('/')}>
              <ListItemPrefix>
                <HiMiniComputerDesktop className="h-5 w-5" />
              </ListItemPrefix>
              Dashboard
            </ListItem>
            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <HiMapPin className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Location
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem onClick={() => router.push('/location/maps')}>
                  <ListItemPrefix className="ml-4">
                    <HiMap className="h-4 w-4" />
                  </ListItemPrefix>
                  Maps
                </ListItem>
                <ListItem onClick={() => router.push('/location/detail')}>
                  <ListItemPrefix className="ml-4">
                    <HiMiniCpuChip className="h-4 w-4" />
                  </ListItemPrefix>
                  Detail
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>

          <div className="absolute w-[17rem] bottom-5">
            <Button
              variant="text"
              className="inline-flex w-full h-12 items-center justify-center gap-2 bg-gray-300 text-gray-600 hover:bg-gray-400"
              onClick={async () => {
                if (confirm('are you sure?')) {
                  await signOut();
                }
              }}
            >
              <HiMiniArrowRightOnRectangle size={24} weight="bold" />
              <Typography className="font-semibold capitalize">
                Sign Out
              </Typography>
            </Button>
          </div>
        </List>
      </Card>
    </>
  );
}
