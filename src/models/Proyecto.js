// Modelo de Proyecto
/**
 * @typedef {Object} Proyecto
 * @property {string} id - UUID único
 * @property {string} nombre - Nombre del proyecto
 * @property {string} descripcion - Descripción del proyecto
 * @property {string} color - Color para identificación visual
 * @property {number} cantidadFacturas - Contador de facturas
 * @property {number} montoTotal - Suma total de facturas
 * @property {string} fechaCreacion - ISO 8601 timestamp
 * @property {boolean} activo - Estado del proyecto
 */

// Colores disponibles para proyectos
export const coloresProyecto = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
];

// Valores por defecto
export const proyectoDefault = {
  descripcion: '',
  color: coloresProyecto[0],
  cantidadFacturas: 0,
  montoTotal: 0,
  activo: true,
};

export const crearProyecto = (datos) => {
  return {
    id: `proyecto-${Date.now()}`,
    nombre: datos.nombre || '',
    descripcion: datos.descripcion || '',
    color: datos.color || coloresProyecto[Math.floor(Math.random() * coloresProyecto.length)],
    cantidadFacturas: 0,
    montoTotal: 0,
    fechaCreacion: new Date().toISOString(),
    activo: true,
  };
};
