import { Spinner } from '@material-tailwind/react';
import axios from 'axios';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const position = [-6.2, 106.816666];

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
  }, [session]);

  if (stations.length == 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner color="green" className="h-10 w-10" />
      </div>
    );
  }

  return (
    <MapContainer center={position} zoom={7}>
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
              <p>Name: {station.name}</p>
              <p>Title: {station.title}</p>
              <p>Status: {station.status}</p>
              <Link href={`/location/detail/${station.name}`}>
                Lihat detail
              </Link>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
