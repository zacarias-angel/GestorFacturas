/**
 * Formatea un número como moneda
 * @param {number} valor - Valor a formatear
 * @param {string} moneda - Símbolo de moneda (default: '$')
 * @returns {string}
 */
export const formatearMoneda = (valor, moneda = '$') => {
  if (valor === null || valor === undefined) return `${moneda}0.00`;
  return `${moneda}${parseFloat(valor).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Formatea una fecha
 * @param {Date|string} fecha - Fecha a formatear
 * @param {string} formato - Formato deseado ('corto', 'largo', 'completo')
 * @returns {string}
 */
export const formatearFecha = (fecha, formato = 'corto') => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  
  if (!(date instanceof Date) || isNaN(date)) {
    return 'Fecha inválida';
  }

  const opciones = {
    corto: { year: 'numeric', month: '2-digit', day: '2-digit' },
    largo: { year: 'numeric', month: 'long', day: 'numeric' },
    completo: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
  };

  return date.toLocaleDateString('es-ES', opciones[formato] || opciones.corto);
};

/**
 * Formatea un número de teléfono
 * @param {string} telefono - Número a formatear
 * @returns {string}
 */
export const formatearTelefono = (telefono) => {
  const limpio = telefono.replace(/\D/g, '');
  
  if (limpio.length === 10) {
    return `(${limpio.slice(0, 3)}) ${limpio.slice(3, 6)}-${limpio.slice(6)}`;
  }
  
  return telefono;
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} texto - Texto a truncar
 * @param {number} longitud - Longitud máxima
 * @param {string} sufijo - Sufijo a agregar (default: '...')
 * @returns {string}
 */
export const truncarTexto = (texto, longitud = 50, sufijo = '...') => {
  if (!texto) return '';
  if (texto.length <= longitud) return texto;
  return texto.substring(0, longitud) + sufijo;
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} texto - Texto a capitalizar
 * @returns {string}
 */
export const capitalizarPalabras = (texto) => {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};

/**
 * Formatea un porcentaje
 * @param {number} valor - Valor a formatear (0-1 o 0-100)
 * @param {boolean} esDecimal - Si el valor es decimal (0-1)
 * @returns {string}
 */
export const formatearPorcentaje = (valor, esDecimal = true) => {
  const porcentaje = esDecimal ? valor * 100 : valor;
  return `${porcentaje.toFixed(2)}%`;
};

/**
 * Formatea bytes a tamaño legible
 * @param {number} bytes - Cantidad de bytes
 * @returns {string}
 */
export const formatearTamanoArchivo = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const tamaños = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${tamaños[i]}`;
};

/**
 * Convierte un texto a slug (URL-friendly)
 * @param {string} texto - Texto a convertir
 * @returns {string}
 */
export const convertirASlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Formatea tiempo relativo ("hace 5 minutos")
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string}
 */
export const formatearTiempoRelativo = (fecha) => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  const ahora = new Date();
  const diferencia = Math.floor((ahora - date) / 1000); // en segundos

  if (diferencia < 60) return 'Hace un momento';
  if (diferencia < 3600) return `Hace ${Math.floor(diferencia / 60)} minutos`;
  if (diferencia < 86400) return `Hace ${Math.floor(diferencia / 3600)} horas`;
  if (diferencia < 604800) return `Hace ${Math.floor(diferencia / 86400)} días`;
  
  return formatearFecha(date, 'corto');
};

export default {
  formatearMoneda,
  formatearFecha,
  formatearTelefono,
  truncarTexto,
  capitalizarPalabras,
  formatearPorcentaje,
  formatearTamanoArchivo,
  convertirASlug,
  formatearTiempoRelativo,
};
