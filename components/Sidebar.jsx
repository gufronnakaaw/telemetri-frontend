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
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import {
  HiChevronDown,
  HiCog,
  HiMapPin,
  HiMiniArrowRightOnRectangle,
  HiMiniComputerDesktop,
} from 'react-icons/hi2';

export default function Sidebar() {
  const router = useRouter();
  const path = router.asPath;
  const [open, setOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const session = useSession();

  useEffect(() => {
    if (session.status == 'authenticated') {
      getDataMaps();
    }

    async function getDataMaps() {
      try {
        const { data } = await axios.get(
          'http://103.112.163.137:3001/api/location/maps',
          {
            headers: {
              token: session.data.user.token,
            },
          }
        );

        setStations(data);
      } catch (error) {
        console.log(error);
      }
    }

    return () => {};
  }, [session]);

  if (session.status == 'loading') {
    return;
  }

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
            open={path.startsWith('/stations') || open}
            icon={
              <HiChevronDown
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            }
          >
            <ListItem
              onClick={() => router.push('/')}
              className={`${path == '/' ? 'active' : ''}`}
            >
              <ListItemPrefix>
                <HiMiniComputerDesktop className="h-5 w-5" />
              </ListItemPrefix>
              Dashboard
            </ListItem>
            <ListItem
              className="p-0"
              selected={path.startsWith('/stations') || open}
            >
              <AccordionHeader
                onClick={() => setOpen(!open)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <FaMapLocationDot className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Stations
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              {stations.length == 0 ? (
                <p>Loading...</p>
              ) : (
                stations.data.map((station, index) => {
                  return (
                    <List className="p-0" key={index}>
                      <ListItem
                        onClick={() =>
                          router.push(`/stations/detail/${station.name}`)
                        }
                        className={`${
                          path == `/stations/detail/${station.name}`
                            ? 'active'
                            : ''
                        }`}
                      >
                        <ListItemPrefix className="ml-4">
                          <HiMapPin className="h-5 w-5" />
                        </ListItemPrefix>
                        {station.title}
                      </ListItem>
                    </List>
                  );
                })
              )}
            </AccordionBody>
            {session.data.user.role == 'admin' ? (
              <ListItem
                onClick={() => router.push('/settings')}
                className={`${path == '/settings' ? 'active' : ''}`}
              >
                <ListItemPrefix>
                  <HiCog className="h-5 w-5" />
                </ListItemPrefix>
                Settings
              </ListItem>
            ) : null}
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
