import axios from 'axios';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const position = [-6.2, 106.816666];

const icon = new Icon({
  iconUrl: '/images/pin.png',
  iconSize: [38, 38],
});

export default function Maps() {
  const [data, setData] = useState([]);

  async function getDataMaps() {
    try {
      const { data } = await axios.get('/api/maps');
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDataMaps();
  }, []);

  return (
    <MapContainer center={position} zoom={7}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((marker, index) => {
        return (
          <Marker position={marker.geocode} icon={icon} key={index}>
            <Popup>
              <p>Name: {marker.name}</p>
              <p>Status: {marker.status}</p>
              <Link href={`/location/detail/${marker.id}`}>Lihat detail</Link>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
