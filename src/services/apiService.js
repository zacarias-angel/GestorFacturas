/**
 * Servicio API para conectar React Native con el backend PHP
 * 
 * IMPORTANTE: Cambia la IP según tu configuración:
 * - Emulador Android: http://10.0.2.2/gestorFactura/gestorFacturaExpo/back/api
 * - Dispositivo físico en misma red: http://192.168.X.X/gestorFactura/gestorFacturaExpo/back/api
 * - Expo Go: Usa tu IP local (192.168.X.X)
 */

// Configuración de la API
const API_CONFIG = {
  // ⚠️ IMPORTANTE: Cambia según tu entorno
  // Para Expo Go en dispositivo físico (misma red WiFi):
  BASE_URL: 'https://thebermuda.com/projects/GestorFacturas/api',
  
  // Para emulador Android, descomenta esta línea:
  // BASE_URL: 'http://10.0.2.2/back/api',
  
  TIMEOUT: 30000, // 30 segundos
};

/**
 * Manejo de errores de la API
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Realiza una petición HTTP a la API
 */
const fetchWithTimeout = async (url, options = {}, timeout = API_CONFIG.TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Intentar parsear JSON
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      // Log para depuración
      console.error('API Error:', {
        url,
        status: response.status,
        data,
      });
      
      throw new ApiError(
        data?.message || data?.error || `Error HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new ApiError('Tiempo de espera agotado', 408);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      'Error de conexión. Verifica que el servidor esté corriendo.',
      0,
      { originalError: error.message }
    );
  }
};

/**
 * ============================================
 * SERVICIOS DE PROYECTOS
 * ============================================
 */

export const proyectosAPI = {
  /**
   * Obtener todos los proyectos
   */
  obtenerTodos: async () => {
    try {
      const url = `${API_CONFIG.BASE_URL}/proyectos.php`;
      const data = await fetchWithTimeout(url);
      // El backend puede devolver { data: [...] } o directamente [...]
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      throw error;
    }
  },

  /**
   * Obtener un proyecto por ID
   */
  obtenerPorId: async (id) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/proyectos.php?id=${id}`;
      const data = await fetchWithTimeout(url);
      return Array.isArray(data) ? data[0] : (data.data || data);
    } catch (error) {
      console.error(`Error al obtener proyecto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo proyecto
   */
  crear: async (proyecto) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/proyectos.php`;
      const data = await fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(proyecto),
      });
      return data.data || data;
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un proyecto existente
   */
  actualizar: async (id, proyecto) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/proyectos.php`;
      const data = await fetchWithTimeout(url, {
        method: 'PUT',
        body: JSON.stringify({ id, ...proyecto }),
      });
      return data.data || data;
    } catch (error) {
      console.error(`Error al actualizar proyecto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un proyecto (soft delete)
   */
  eliminar: async (id) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/proyectos.php`;
      const data = await fetchWithTimeout(url, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      return data;
    } catch (error) {
      console.error(`Error al eliminar proyecto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de proyectos
   */
  obtenerEstadisticas: async () => {
    try {
      const url = `${API_CONFIG.BASE_URL}/proyectos.php?estadisticas=1`;
      const data = await fetchWithTimeout(url);
      return data.data || data;
    } catch (error) {
      console.error('Error al obtener estadísticas de proyectos:', error);
      throw error;
    }
  },
};

/**
 * ============================================
 * SERVICIOS DE FACTURAS
 * ============================================
 */

export const facturasAPI = {
  /**
   * Obtener todas las facturas
   */
  obtenerTodas: async (opciones = {}) => {
    try {
      const { limit = 100, offset = 0 } = opciones;
      const url = `${API_CONFIG.BASE_URL}/facturas.php?limit=${limit}&offset=${offset}`;
      const data = await fetchWithTimeout(url);
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      throw error;
    }
  },

  /**
   * Obtener una factura por ID
   */
  obtenerPorId: async (id) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/facturas.php?id=${id}`;
      const data = await fetchWithTimeout(url);
      return Array.isArray(data) ? data[0] : (data.data || data);
    } catch (error) {
      console.error(`Error al obtener factura ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener facturas de un proyecto específico
   */
  obtenerPorProyecto: async (proyectoId) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/facturas.php?proyecto=${proyectoId}`;
      const data = await fetchWithTimeout(url);
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error(`Error al obtener facturas del proyecto ${proyectoId}:`, error);
      throw error;
    }
  },

  /**
   * Obtener facturas sin proyecto (gastos generales)
   */
  obtenerSinProyecto: async () => {
    try {
      const url = `${API_CONFIG.BASE_URL}/facturas.php?sin_proyecto=1`;
      const data = await fetchWithTimeout(url);
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Error al obtener facturas sin proyecto:', error);
      throw error;
    }
  },

  /**
   * Buscar facturas por texto
   */
  buscar: async (termino) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/facturas.php?search=${encodeURIComponent(termino)}`;
      const data = await fetchWithTimeout(url);
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Error al buscar facturas:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva factura
   */
  crear: async (factura) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/facturas.php`;
      const data = await fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(factura),
      });
      return data.data || data;
    } catch (error) {
      console.error('Error al crear factura:', error);
      throw error;
    }
  },

  /**
   * Actualizar una factura existente
   */
  actualizar: async (id, factura) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/facturas.php`;
      const data = await fetchWithTimeout(url, {
        method: 'PUT',
        body: JSON.stringify({ id, ...factura }),
      });
      return data.data || data;
    } catch (error) {
      console.error(`Error al actualizar factura ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una factura
   */
  eliminar: async (id) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/facturas.php`;
      const data = await fetchWithTimeout(url, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      return data;
    } catch (error) {
      console.error(`Error al eliminar factura ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de facturas
   */
  obtenerEstadisticas: async () => {
    try {
      const url = `${API_CONFIG.BASE_URL}/facturas.php?estadisticas=1`;
      const data = await fetchWithTimeout(url);
      return data.data || data;
    } catch (error) {
      console.error('Error al obtener estadísticas de facturas:', error);
      throw error;
    }
  },
};

/**
 * ============================================
 * SERVICIOS DE UPLOAD
 * ============================================
 */

export const uploadAPI = {
  /**
   * Subir imagen de factura al servidor
   * @param {string} imageUri - URI local de la imagen
   * @returns {Promise<string>} URL pública de la imagen
   */
  subirImagen: async (imageUri) => {
    try {
      // Crear FormData para enviar la imagen
      const formData = new FormData();
      
      // Obtener el nombre y tipo del archivo
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
      });
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/upload.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new ApiError(
          data?.error || 'Error al subir imagen',
          response.status,
          data
        );
      }
      
      return data.url;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  },
};

/**
 * ============================================
 * SERVICIOS DE EXPORTACIÓN
 * ============================================
 */

export const exportarAPI = {
  /**
   * Exportar facturas a Excel
   * @param {Object} opciones - Opciones de filtro
   * @returns {Promise<string>} URL del archivo generado
   */
  exportarFacturas: async (opciones = {}) => {
    try {
      const params = new URLSearchParams({
        type: 'facturas',
        ...opciones,
      });
      
      const url = `${API_CONFIG.BASE_URL}/export.php?${params.toString()}`;
      
      // Esta URL debe abrirse en el navegador para descargar el archivo
      return url;
    } catch (error) {
      console.error('Error al generar URL de exportación de facturas:', error);
      throw error;
    }
  },

  /**
   * Exportar proyectos a Excel
   * @returns {Promise<string>} URL del archivo generado
   */
  exportarProyectos: async () => {
    try {
      const url = `${API_CONFIG.BASE_URL}/export.php?type=proyectos`;
      
      // Esta URL debe abrirse en el navegador para descargar el archivo
      return url;
    } catch (error) {
      console.error('Error al generar URL de exportación de proyectos:', error);
      throw error;
    }
  },
};

/**
 * ============================================
 * UTILIDADES
 * ============================================
 */

/**
 * Verifica la conexión con el servidor
 */
export const verificarConexion = async () => {
  try {
    const url = `${API_CONFIG.BASE_URL}/proyectos.php`;
    await fetchWithTimeout(url, {}, 5000); // Timeout corto de 5 segundos
    return true;
  } catch (error) {
    console.error('Error de conexión:', error);
    return false;
  }
};

/**
 * Obtiene la configuración actual de la API
 */
export const obtenerConfiguracion = () => {
  return { ...API_CONFIG };
};

/**
 * Actualiza la URL base de la API
 */
export const configurarAPI = (nuevaUrl) => {
  API_CONFIG.BASE_URL = nuevaUrl;
};

export default {
  proyectos: proyectosAPI,
  facturas: facturasAPI,
  upload: uploadAPI,
  exportar: exportarAPI,
  verificarConexion,
  obtenerConfiguracion,
  configurarAPI,
  ApiError,
};
