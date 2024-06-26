import { Spinner } from '@material-tailwind/react';
import axios from 'axios';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const position = [-1.26916, 116.825264];

const icon = new Icon({
  iconUrl: '/images/pin.png',
  iconSize: [38, 38],
});

export default function Maps() {
  const [stations, setStations] = useState([]);
  const session = useSession();

  useEffect(() => {
    if (session.status == 'authenticated') {
      getDataMaps();
    }

    async function getDataMaps() {
      try {
        const { data } = await axios.get(
          'http://iotindonesia.online:1414/api/location/maps',
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
  }, [session]);

  if (stations.length == 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <MapContainer center={position} zoom={5}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.data.map((station, index) => {
        return (
          <Marker
            position={[station.lat, station.long]}
            icon={icon}
            key={index}
          >
            <Popup>
              {session.data.user.role == 'admin' ? (
                <p>Name: {station.name}</p>
              ) : null}
              <p>Title: {station.title}</p>
              <p>Status: {station.status}</p>
              <Link href={`/stations/detail/${station.name}`}>
                Lihat detail
              </Link>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
