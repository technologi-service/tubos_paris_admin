import type { APIRoute } from 'astro';
import prisma from '../../../db/prisma';

export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      message: 'This was a GET!',
    })
  );
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('Cuerpo recibido:', body); // Log para inspeccionar los datos recibidos
    const { rangos } = body;

    // Validación de los datos recibidos
    if (!Array.isArray(rangos) || rangos.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Datos inválidos: rangos debe ser un arreglo no vacío' }),
        { status: 400 }
      );
    }

    const results = [];
    const errores = [];

    for (const r of rangos) {
      // Validar que cada rango tenga los campos necesarios
      if (
        !r.id ||
        typeof r.id !== 'number' ||
        typeof r.score_min !== 'number' ||
        typeof r.score_max !== 'number' ||
        typeof r.nombre_categoria !== 'string' ||
        typeof r.segmento !== 'string'
      ) {
        errores.push({ id: r.id, error: 'Datos incompletos o inválidos' });
        continue;
      }

      try {
        // Actualización de cada rango en la base de datos
        const updated = await prisma.segmento_categorico.update({
          where: { id: r.id },
          data: {
            nombre_categoria: r.nombre_categoria,
            score_min: r.score_min,
            score_max: r.score_max,
            segmento: r.segmento,
          },
        });
        results.push(updated);
      } catch (updateError) {
        console.error(`Error actualizando el rango con id ${r.id}:`, updateError);
        errores.push({ id: r.id, error: 'Error al actualizar en la base de datos' });
      }
    }

    // Respuesta con resultados y errores
    return new Response(
      JSON.stringify({
        message: 'Proceso completado',
        actualizados: results,
        errores,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error PATCH rangos:', error);
    return new Response(JSON.stringify({ error: 'No se pudo procesar la solicitud' }), {
      status: 500,
    });
  }
};

export const DELETE: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: 'This was a DELETE!',
    })
  );
};

export const ALL: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: `This was a ${request.method}!`,
    })
  );
};
