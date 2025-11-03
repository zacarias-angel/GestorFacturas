/**
 * Valida los datos de una factura
 * @param {Object} factura - Objeto factura a validar
 * @returns {Object} - Objeto con errores (vacío si no hay errores)
 */
export const validarFactura = (factura) => {
  const errores = {};

  // Validar precio total
  if (!factura.precioTotal || factura.precioTotal <= 0) {
    errores.precioTotal = 'El precio total debe ser mayor a 0';
  }

  // Validar monto extra
  if (factura.montoExtra && factura.montoExtra < 0) {
    errores.montoExtra = 'El monto extra no puede ser negativo';
  }

  // Validar descripción
  if (!factura.descripcion || factura.descripcion.trim().length < 5) {
    errores.descripcion = 'La descripción debe tener al menos 5 caracteres';
  }

  if (factura.descripcion && factura.descripcion.length > 500) {
    errores.descripcion = 'La descripción no puede exceder 500 caracteres';
  }

  // Validar proyecto
  if (!factura.proyectoId) {
    errores.proyectoId = 'Debe seleccionar un proyecto';
  }

  // Validar imagen
  if (!factura.imagenUri) {
    errores.imagenUri = 'Debe capturar o seleccionar una imagen';
  }

  return errores;
};

/**
 * Valida los datos de un proyecto
 * @param {Object} proyecto - Objeto proyecto a validar
 * @returns {Object} - Objeto con errores (vacío si no hay errores)
 */
export const validarProyecto = (proyecto) => {
  const errores = {};

  // Validar nombre
  if (!proyecto.nombre || proyecto.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres';
  }

  if (proyecto.nombre && proyecto.nombre.length > 50) {
    errores.nombre = 'El nombre no puede exceder 50 caracteres';
  }

  // Validar descripción (opcional)
  if (proyecto.descripcion && proyecto.descripcion.length > 200) {
    errores.descripcion = 'La descripción no puede exceder 200 caracteres';
  }

  return errores;
};

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida un número de teléfono
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean}
 */
export const validarTelefono = (telefono) => {
  const regex = /^\+?[\d\s-()]+$/;
  return regex.test(telefono) && telefono.replace(/\D/g, '').length >= 10;
};

/**
 * Valida que un número esté en un rango
 * @param {number} valor - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean}
 */
export const validarRango = (valor, min, max) => {
  return valor >= min && valor <= max;
};

/**
 * Valida formato de URL
 * @param {string} url - URL a validar
 * @returns {boolean}
 */
export const validarURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default {
  validarFactura,
  validarProyecto,
  validarEmail,
  validarTelefono,
  validarRango,
  validarURL,
};
