import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FACTURAS: '@gestorFactura:facturas',
  PROYECTOS: '@gestorFactura:proyectos',
  CONFIGURACION: '@gestorFactura:config',
  ULTIMA_SINCRONIZACION: '@gestorFactura:lastSync',
};

/**
 * Guarda datos en AsyncStorage
 * @param {string} clave - Clave única para los datos
 * @param {any} datos - Datos a guardar
 * @returns {Promise<boolean>}
 */
export const guardar = async (clave, datos) => {
  try {
    const jsonDatos = JSON.stringify(datos);
    await AsyncStorage.setItem(clave, jsonDatos);
    return true;
  } catch (error) {
    console.error('Error al guardar datos:', error);
    throw new Error('No se pudieron guardar los datos');
  }
};

/**
 * Obtiene datos de AsyncStorage
 * @param {string} clave - Clave de los datos
 * @returns {Promise<any|null>}
 */
export const obtener = async (clave) => {
  try {
    const jsonDatos = await AsyncStorage.getItem(clave);
    return jsonDatos != null ? JSON.parse(jsonDatos) : null;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return null;
  }
};

/**
 * Elimina datos de AsyncStorage
 * @param {string} clave - Clave a eliminar
 * @returns {Promise<boolean>}
 */
export const eliminar = async (clave) => {
  try {
    await AsyncStorage.removeItem(clave);
    return true;
  } catch (error) {
    console.error('Error al eliminar datos:', error);
    return false;
  }
};

/**
 * Limpia todo el almacenamiento
 * @returns {Promise<boolean>}
 */
export const limpiar = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error al limpiar almacenamiento:', error);
    return false;
  }
};

/**
 * Obtiene todas las claves que coinciden con un patrón
 * @param {string} patron - Patrón a buscar
 * @returns {Promise<string[]>}
 */
export const obtenerClaves = async (patron = '') => {
  try {
    const todasLasClaves = await AsyncStorage.getAllKeys();
    if (patron) {
      return todasLasClaves.filter(clave => clave.includes(patron));
    }
    return todasLasClaves;
  } catch (error) {
    console.error('Error al obtener claves:', error);
    return [];
  }
};

/**
 * Obtiene múltiples valores a la vez
 * @param {string[]} claves - Array de claves
 * @returns {Promise<Object>}
 */
export const obtenerMultiples = async (claves) => {
  try {
    const valores = await AsyncStorage.multiGet(claves);
    const resultado = {};
    valores.forEach(([clave, valor]) => {
      resultado[clave] = valor ? JSON.parse(valor) : null;
    });
    return resultado;
  } catch (error) {
    console.error('Error al obtener múltiples valores:', error);
    return {};
  }
};

export default {
  STORAGE_KEYS,
  guardar,
  obtener,
  eliminar,
  limpiar,
  obtenerClaves,
  obtenerMultiples,
};
