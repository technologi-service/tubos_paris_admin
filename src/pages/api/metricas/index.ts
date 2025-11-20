import type { APIRoute } from 'astro';
import prisma from '../../../db/prisma';

export const GET: APIRoute = async () => {
  try {
    // Consulta los datos desde el modelo clientes_csv
    const clientes = await prisma.clientes_csv.findMany({
      select: {
        segmento: true,
      },
    });

    // Contar la cantidad de clientes por segmento
    const segmentCounts = clientes.reduce((acc: Record<string, number>, cliente) => {
      const segmento = cliente.segmento || 'Sin segmento';
      acc[segmento] = (acc[segmento] || 0) + 1;
      return acc;
    }, {});

    // Asegurar el orden de los segmentos del 1 al 5
    const orderedSegments = ['1*', '2*', '3*', '4*', '5*'];
    const categories = orderedSegments;
    const data = orderedSegments.map((segment) => segmentCounts[segment] || 0);

    const series = [
      {
        name: 'Clientes',
        data,
      },
    ];

    return new Response(JSON.stringify({ series, categories }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al obtener las métricas:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener las métricas' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
