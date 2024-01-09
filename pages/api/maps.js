export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      name: 'Jakarta Station',
      geocode: [-6.2, 106.816666],
      status: 'active',
    },
    {
      id: 2,
      name: 'Depok Station',
      geocode: [-6.402905, 106.778419],
      status: 'active',
    },
    {
      id: 3,
      name: 'Yogyakarta Station',
      geocode: [-7.797068, 110.370529],
      status: 'active',
    },
  ]);
}
