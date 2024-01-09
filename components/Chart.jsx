import dynamic from 'next/dynamic';

const ChartApex = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Chart() {
  const options = {
    chart: {
      id: 'apexchart-example',
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };

  const series = [
    {
      name: 'series-1',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];
  return (
    <ChartApex options={options} series={series} width="100%" height="90%" />
  );
}
