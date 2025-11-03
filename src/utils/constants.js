// Constantes de la aplicación

// Estados de facturas
export const ESTADOS_FACTURA = {
  PENDIENTE: 'pendiente',
  PROCESADA: 'procesada',
  APROBADA: 'aprobada',
};

// Colores de estados
export const COLORES_ESTADO = {
  [ESTADOS_FACTURA.PENDIENTE]: '#ff9800',
  [ESTADOS_FACTURA.PROCESADA]: '#2196f3',
  [ESTADOS_FACTURA.APROBADA]: '#4caf50',
};

// Textos de estados
export const TEXTOS_ESTADO = {
  [ESTADOS_FACTURA.PENDIENTE]: 'Pendiente',
  [ESTADOS_FACTURA.PROCESADA]: 'Procesada',
  [ESTADOS_FACTURA.APROBADA]: 'Aprobada',
};

// Keys de AsyncStorage
export const STORAGE_KEYS = {
  FACTURAS: '@gestorFactura:facturas',
  PROYECTOS: '@gestorFactura:proyectos',
  CONFIGURACION: '@gestorFactura:config',
  ULTIMA_SINCRONIZACION: '@gestorFactura:lastSync',
};

// Límites de validación
export const LIMITES = {
  DESCRIPCION_MIN: 5,
  DESCRIPCION_MAX: 500,
  NOMBRE_PROYECTO_MIN: 3,
  NOMBRE_PROYECTO_MAX: 50,
  DESCRIPCION_PROYECTO_MAX: 200,
  PRECIO_MIN: 0.01,
  PRECIO_MAX: 999999.99,
};

// Configuración de imágenes
export const CONFIG_IMAGEN = {
  CALIDAD: 0.8,
  MAX_ANCHO: 1920,
  MAX_ALTO: 1080,
  FORMATO: 'JPEG',
};

// Configuración de PDF
export const CONFIG_PDF = {
  TAMANO_PAGINA: 'A4',
  ORIENTACION_AUTO: true,
  COMPRESION: true,
};

// Colores del tema
export const COLORES_TEMA = {
  PRIMARIO: '#2196F3',
  SECUNDARIO: '#FF6B6B',
  EXITO: '#4caf50',
  ADVERTENCIA: '#ff9800',
  ERROR: '#f44336',
  FONDO: '#f5f5f5',
  TEXTO: '#333333',
  TEXTO_SECUNDARIO: '#666666',
  TEXTO_TERCIARIO: '#999999',
  BLANCO: '#ffffff',
  BORDE: '#dddddd',
};

// Colores disponibles para proyectos
export const COLORES_PROYECTO = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F8B195', '#F67280', '#C06C84', '#6C5B7B',
];

// Mensajes de error comunes
export const MENSAJES_ERROR = {
  GUARDAR_FACTURA: 'No se pudo guardar la factura',
  CARGAR_FACTURAS: 'No se pudieron cargar las facturas',
  ELIMINAR_FACTURA: 'No se pudo eliminar la factura',
  GUARDAR_PROYECTO: 'No se pudo guardar el proyecto',
  CARGAR_PROYECTOS: 'No se pudieron cargar los proyectos',
  ELIMINAR_PROYECTO: 'No se pudo eliminar el proyecto',
  CAPTURA_IMAGEN: 'No se pudo capturar la imagen',
  CONVERTIR_PDF: 'No se pudo convertir la imagen a PDF',
  PERMISOS_CAMARA: 'Se requieren permisos de cámara',
  PERMISOS_ALMACENAMIENTO: 'Se requieren permisos de almacenamiento',
  RED: 'Error de conexión',
  DESCONOCIDO: 'Ocurrió un error inesperado',
};

// Mensajes de éxito
export const MENSAJES_EXITO = {
  GUARDAR_FACTURA: 'Factura guardada correctamente',
  ACTUALIZAR_FACTURA: 'Factura actualizada correctamente',
  ELIMINAR_FACTURA: 'Factura eliminada correctamente',
  GUARDAR_PROYECTO: 'Proyecto guardado correctamente',
  ACTUALIZAR_PROYECTO: 'Proyecto actualizado correctamente',
  ELIMINAR_PROYECTO: 'Proyecto eliminado correctamente',
};

// Configuración de navegación
export const RUTAS = {
  MAIN_TABS: 'MainTabs',
  HOME: 'Home',
  FACTURAS: 'Facturas',
  PROYECTOS: 'Proyectos',
  NUEVA_FACTURA: 'NuevaFactura',
  DETALLE_FACTURA: 'DetalleFactura',
  EDITAR_FACTURA: 'EditarFactura',
  NUEVO_PROYECTO: 'NuevoProyecto',
  DETALLE_PROYECTO: 'DetalleProyecto',
};

// Configuración de paginación
export const PAGINACION = {
  ITEMS_POR_PAGINA: 20,
  CARGA_INICIAL: 10,
};

// Formatos de fecha
export const FORMATOS_FECHA = {
  CORTO: 'DD/MM/YYYY',
  LARGO: 'DD de MMMM de YYYY',
  COMPLETO: 'DD/MM/YYYY HH:mm',
  HORA: 'HH:mm',
};

// Configuración de sincronización (para futuro)
export const CONFIG_SYNC = {
  INTERVALO_AUTO: 300000, // 5 minutos
  REINTENTOS_MAX: 3,
  TIMEOUT: 30000, // 30 segundos
};

export default {
  ESTADOS_FACTURA,
  COLORES_ESTADO,
  TEXTOS_ESTADO,
  STORAGE_KEYS,
  LIMITES,
  CONFIG_IMAGEN,
  CONFIG_PDF,
  COLORES_TEMA,
  COLORES_PROYECTO,
  MENSAJES_ERROR,
  MENSAJES_EXITO,
  RUTAS,
  PAGINACION,
  FORMATOS_FECHA,
  CONFIG_SYNC,
};
