// Modelo de Factura
/**
 * @typedef {Object} Factura
 * @property {string} id - UUID único
 * @property {number} precioTotal - Precio principal de la factura
 * @property {number} montoExtra - Monto adicional/extra
 * @property {string} descripcion - Descripción detallada
 * @property {string} proyectoId - ID del proyecto asociado
 * @property {string} proyectoNombre - Nombre del proyecto
 * @property {string} imagenUri - URI de la imagen capturada
 * @property {string} pdfUri - URI del PDF generado
 * @property {string} fechaCreacion - ISO 8601 timestamp
 * @property {string} fechaModificacion - ISO 8601 timestamp
 * @property {'pendiente'|'procesada'|'aprobada'} estado - Estado de la factura
 */

// Valores por defecto para crear nueva factura
export const facturaDefault = {
  precioTotal: 0,
  montoExtra: 0,
  descripcion: '',
  estado: 'pendiente',
};

export const crearFactura = (datos) => {
  const fecha = new Date().toISOString();
  return {
    id: `factura-${Date.now()}`,
    precioTotal: datos.precioTotal || 0,
    montoExtra: datos.montoExtra || 0,
    descripcion: datos.descripcion || '',
    proyectoId: datos.proyectoId || '',
    proyectoNombre: datos.proyectoNombre || '',
    imagenUri: datos.imagenUri || '',
    pdfUri: datos.pdfUri || '',
    fechaCreacion: fecha,
    fechaModificacion: fecha,
    estado: datos.estado || 'pendiente',
  };
};

export const calcularTotalFactura = (factura) => {
  return factura.precioTotal + factura.montoExtra;
};
