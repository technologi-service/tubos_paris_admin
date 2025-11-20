import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartState {
  series: Array<{ name: string; data: number[]; color?: string }>;
  options: {
    chart: {
      type: 'bar';
      height: number;
      stacked: boolean;
      toolbar: { show: boolean };
      zoom: { enabled: boolean };
    };
    responsive: Array<{
      breakpoint: number;
      options: {
        legend: { position: 'bottom'; offsetX: number; offsetY: number };
      };
    }>;
    plotOptions: {
      bar: {
        horizontal: boolean;
        borderRadius: number;
        borderRadiusApplication: 'end';
        borderRadiusWhenStacked: 'last';
        dataLabels: {
          total: {
            enabled: boolean;
            style: { fontSize: string; fontWeight: number };
          };
        };
      };
    };
    xaxis: {
      type: 'category';
      categories: string[];
    };
    legend: { position: 'right'; offsetY: number };
    fill: { opacity: number };
    colors: string[];
  };
}

const ApexChart: React.FC = () => {
  const [state, setState] = useState<ChartState>({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: { show: true },
        zoom: { enabled: true },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: { position: 'bottom', offsetX: -10, offsetY: 0 },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
          dataLabels: {
            total: {
              enabled: true,
              style: { fontSize: '13px', fontWeight: 900 },
            },
          },
        },
      },
      xaxis: {
        type: 'category',
        categories: [],
      },
      legend: { position: 'right', offsetY: 40 },
      fill: { opacity: 1 },
      colors: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/metricas');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();

        console.log('Datos recibidos:', data); // Log para depuración

        if (!data.series || !data.categories) {
          throw new Error('Estructura de datos inválida');
        }

        // Actualizar el estado con los datos recibidos
        setState((prevState) => ({
          ...prevState,
          series: data.series,
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: data.categories,
            },
          },
        }));
      } catch (error) {
        console.error('Error al cargar las métricas:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-center text-xl font-bold mb-4">Gráfico de Métricas</h2>
      <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
    </div>
  );
};

export default ApexChart;
