# 📱 Guía de Integración del Backend con React Native

## 🎯 Resumen

Esta guía te muestra cómo conectar tu app React Native con el backend PHP que acabamos de crear.

---

## 📝 Pasos de Integración

### 1️⃣ Configurar la URL del Backend

Primero, necesitas **encontrar tu IP local** para que React Native pueda comunicarse con el servidor PHP.

#### En Windows (tu caso):
```powershell
ipconfig
```
Busca **"Adaptador de LAN inalámbrica"** o **"Ethernet"** y copia la **IPv4**. Ejemplo: `192.168.1.100`

#### Editar `apiService.js`:
Abre: `src/services/apiService.js`

```javascript
const API_CONFIG = {
  // Cambia esta IP por la tuya:
  BASE_URL: 'http://192.168.1.100/gestorFactura/gestorFacturaExpo/back/api',
  // ☝️ IMPORTANTE: Usa tu IP local, no localhost
  
  TIMEOUT: 30000,
};
```

**💡 Según tu entorno:**
- **Expo Go (dispositivo físico)**: Usa tu IP local → `http://192.168.X.X/...`
- **Emulador Android**: Usa → `http://10.0.2.2/...`
- **iOS Simulator**: Usa → `http://localhost/...`

---

### 2️⃣ Asegurarte de que el Servidor PHP esté corriendo

#### En Laragon:
1. Abre **Laragon**
2. Clic en **"Start All"** (Apache + MySQL)
3. Verifica que ambos estén en verde ✅

#### Importar la Base de Datos:
```powershell
cd C:\Users\Usuario\Desktop\experiencias\gestorFactura\gestorFacturaExpo\back
mysql -u root -p < database.sql
# Cuando pida password, escribe: root
```

#### Probar el API desde el navegador:
Abre: `http://localhost/gestorFactura/gestorFacturaExpo/back/api/proyectos.php`

Deberías ver algo como:
```json
{
  "success": true,
  "message": "Lista de proyectos",
  "data": []
}
```

---

### 3️⃣ Reemplazar AsyncStorage con llamadas al API

Ahora vamos a modificar tus pantallas para usar el backend en lugar de AsyncStorage.

---

## 🔧 Ejemplos de Uso

### **ProyectosScreen.js** - ANTES y DESPUÉS

#### ❌ ANTES (usando AsyncStorage):

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const cargarProyectos = async () => {
  try {
    const data = await AsyncStorage.getItem('@gestorFactura:proyectos');
    if (data) {
      const proyectosObj = JSON.parse(data);
      const proyectosArray = Object.values(proyectosObj);
      setProyectos(proyectosArray);
    }
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
  }
};

const guardarProyecto = async () => {
  // ... validaciones ...
  
  const proyecto = {
    id: `proyecto-${Date.now()}`,
    nombre: nuevoProyecto.nombre.trim(),
    descripcion: nuevoProyecto.descripcion.trim(),
    color: coloresProyecto[Math.floor(Math.random() * coloresProyecto.length)],
    // ...
  };

  const data = await AsyncStorage.getItem('@gestorFactura:proyectos');
  const proyectosObj = data ? JSON.parse(data) : {};
  proyectosObj[proyecto.id] = proyecto;
  
  await AsyncStorage.setItem('@gestorFactura:proyectos', JSON.stringify(proyectosObj));
  // ...
};
```

---

#### ✅ DESPUÉS (usando el API):

```javascript
import apiService from '../services/apiService';
// Ya NO necesitas AsyncStorage para proyectos

const cargarProyectos = async () => {
  try {
    // Muestra un indicador de carga
    setLoading(true);
    
    // Llama al backend
    const proyectosData = await apiService.proyectos.obtenerTodos();
    
    setProyectos(proyectosData);
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    Alert.alert(
      'Error de conexión', 
      'No se pudieron cargar los proyectos. Verifica tu conexión.'
    );
  } finally {
    setLoading(false);
  }
};

const guardarProyecto = async () => {
  if (!nuevoProyecto.nombre || nuevoProyecto.nombre.trim().length < 3) {
    Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres');
    return;
  }

  try {
    setLoading(true);
    
    // Prepara los datos (el backend genera el ID)
    const nuevoProyectoData = {
      nombre: nuevoProyecto.nombre.trim(),
      descripcion: nuevoProyecto.descripcion.trim(),
      color: coloresProyecto[Math.floor(Math.random() * coloresProyecto.length)],
    };
    
    // Envía al backend
    const proyectoCreado = await apiService.proyectos.crear(nuevoProyectoData);
    
    // Actualiza la lista local
    setProyectos([...proyectos, proyectoCreado]);
    setVisible(false);
    setNuevoProyecto({ nombre: '', descripcion: '' });
    
    Alert.alert('Éxito', 'Proyecto creado correctamente');
  } catch (error) {
    console.error('Error al guardar proyecto:', error);
    Alert.alert('Error', error.message || 'No se pudo guardar el proyecto');
  } finally {
    setLoading(false);
  }
};

// Nueva función: Eliminar proyecto
const eliminarProyecto = async (id) => {
  Alert.alert(
    'Confirmar',
    '¿Estás seguro de eliminar este proyecto?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await apiService.proyectos.eliminar(id);
            
            // Actualiza la lista local
            setProyectos(proyectos.filter(p => p.id !== id));
            
            Alert.alert('Éxito', 'Proyecto eliminado');
          } catch (error) {
            Alert.alert('Error', error.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]
  );
};
```

---

### **ListaFacturasScreen.js** - Cargar Facturas

#### ✅ Usando el API:

```javascript
import apiService from '../services/apiService';

const [facturas, setFacturas] = useState([]);
const [loading, setLoading] = useState(false);
const [filtroProyecto, setFiltroProyecto] = useState(null); // null = todas

const cargarFacturas = async () => {
  try {
    setLoading(true);
    
    let facturasData;
    
    if (filtroProyecto === 'sin_proyecto') {
      // Facturas sin proyecto (gastos generales)
      facturasData = await apiService.facturas.obtenerSinProyecto();
    } else if (filtroProyecto) {
      // Facturas de un proyecto específico
      facturasData = await apiService.facturas.obtenerPorProyecto(filtroProyecto);
    } else {
      // Todas las facturas
      facturasData = await apiService.facturas.obtenerTodas();
    }
    
    setFacturas(facturasData);
  } catch (error) {
    console.error('Error al cargar facturas:', error);
    Alert.alert('Error', 'No se pudieron cargar las facturas');
  } finally {
    setLoading(false);
  }
};

// Buscar facturas
const buscarFacturas = async (termino) => {
  try {
    setLoading(true);
    const resultados = await apiService.facturas.buscar(termino);
    setFacturas(resultados);
  } catch (error) {
    console.error('Error al buscar:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  cargarFacturas();
}, [filtroProyecto]);
```

---

### **NuevaFacturaScreen.js** - Crear Factura

#### ✅ Usando el API:

```javascript
import apiService from '../services/apiService';

const guardarFactura = async () => {
  // ... validaciones ...
  
  try {
    setLoading(true);
    
    const nuevaFacturaData = {
      numero_factura: numero,
      fecha: fecha.toISOString().split('T')[0], // Formato: YYYY-MM-DD
      proveedor: proveedor.trim(),
      concepto: concepto.trim(),
      monto: parseFloat(monto),
      proyecto_id: proyectoSeleccionado || null, // null si es "Sin proyecto"
      imagen_uri: imagenUri || null,
      notas: notas.trim() || null,
    };
    
    const facturaCreada = await apiService.facturas.crear(nuevaFacturaData);
    
    Alert.alert('Éxito', 'Factura guardada correctamente', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  } catch (error) {
    console.error('Error al guardar factura:', error);
    Alert.alert('Error', error.message || 'No se pudo guardar la factura');
  } finally {
    setLoading(false);
  }
};
```

---

### **HomeScreen.js** - Estadísticas

#### ✅ Usando el API:

```javascript
import apiService from '../services/apiService';

const [estadisticas, setEstadisticas] = useState({
  total_facturas: 0,
  monto_total: 0,
  facturas_mes: 0,
  monto_mes: 0,
});

const cargarEstadisticas = async () => {
  try {
    setLoading(true);
    const stats = await apiService.facturas.obtenerEstadisticas();
    setEstadisticas(stats);
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // Cargar al montar
  cargarEstadisticas();
  
  // Recargar cuando la pantalla reciba foco
  const unsubscribe = navigation.addListener('focus', () => {
    cargarEstadisticas();
  });
  
  return unsubscribe;
}, [navigation]);
```

---

## 📊 Exportar a Excel

Para descargar facturas en Excel desde React Native:

```javascript
import { Linking } from 'react-native';
import apiService from '../services/apiService';

const exportarAExcel = async () => {
  try {
    // Genera la URL de exportación
    const urlExcel = await apiService.exportar.exportarFacturas({
      proyecto: proyectoActual || undefined, // Opcional: filtrar por proyecto
    });
    
    // Abre en el navegador para descargar
    const supported = await Linking.canOpenURL(urlExcel);
    
    if (supported) {
      await Linking.openURL(urlExcel);
      Alert.alert('Éxito', 'Se abrirá el navegador para descargar el archivo');
    } else {
      Alert.alert('Error', 'No se puede abrir la URL de descarga');
    }
  } catch (error) {
    console.error('Error al exportar:', error);
    Alert.alert('Error', 'No se pudo generar el archivo Excel');
  }
};

// Usar en un botón:
<Button mode="contained" onPress={exportarAExcel}>
  Descargar Excel
</Button>
```

---

## 🔄 Manejo de Estados de Carga

Agrega indicadores visuales mientras se cargan datos:

```javascript
import { ActivityIndicator } from 'react-native-paper';

function MiPantalla() {
  const [loading, setLoading] = useState(false);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }
  
  return (
    // Tu contenido normal...
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Network request failed"

**Causa:** React Native no puede conectarse al backend.

**Soluciones:**
1. Verifica que **Laragon esté corriendo** (Apache en verde)
2. Usa tu **IP local**, NO `localhost`
3. Asegúrate de estar en la **misma red WiFi** (app y PC)
4. Desactiva el **firewall temporalmente** para probar
5. En Laragon, verifica que Apache esté escuchando en todas las interfaces

### ❌ Error: "JSON Parse error"

**Causa:** El backend está devolviendo HTML en lugar de JSON (posible error PHP).

**Soluciones:**
1. Abre la URL del API en el **navegador** y verifica que devuelva JSON
2. Revisa los **logs de PHP** en `C:\laragon\www\error.log`
3. Verifica que `config/config.php` tenga las credenciales correctas de MySQL

### ❌ Error: "Timeout"

**Causa:** El backend está tardando mucho en responder.

**Soluciones:**
1. Verifica que la **base de datos esté importada**: `SHOW DATABASES;` → debe aparecer `gestor_facturas`
2. Aumenta el timeout en `apiService.js`: `TIMEOUT: 60000` (60 segundos)

---

## ✅ Checklist de Integración

- [ ] Composer dependencies instaladas (`composer install` ✅)
- [ ] Base de datos importada (`mysql < database.sql`)
- [ ] Laragon corriendo (Apache + MySQL en verde)
- [ ] IP local configurada en `apiService.js`
- [ ] API responde en navegador: `http://localhost/.../api/proyectos.php`
- [ ] Reemplazar AsyncStorage por `apiService` en:
  - [ ] `ProyectosScreen.js`
  - [ ] `ListaFacturasScreen.js`
  - [ ] `NuevaFacturaScreen.js`
  - [ ] `HomeScreen.js`

---

## 📚 Referencia Rápida del API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **Proyectos** |||
| `proyectos.obtenerTodos()` | GET `/proyectos.php` | Lista todos los proyectos |
| `proyectos.crear(datos)` | POST `/proyectos.php` | Crea un proyecto |
| `proyectos.actualizar(id, datos)` | PUT `/proyectos.php` | Actualiza un proyecto |
| `proyectos.eliminar(id)` | DELETE `/proyectos.php` | Elimina (soft) un proyecto |
| **Facturas** |||
| `facturas.obtenerTodas()` | GET `/facturas.php` | Lista todas las facturas |
| `facturas.obtenerPorProyecto(id)` | GET `/facturas.php?proyecto=X` | Facturas de un proyecto |
| `facturas.obtenerSinProyecto()` | GET `/facturas.php?sin_proyecto=1` | Gastos generales |
| `facturas.buscar(termino)` | GET `/facturas.php?search=X` | Buscar facturas |
| `facturas.crear(datos)` | POST `/facturas.php` | Crea una factura |
| `facturas.eliminar(id)` | DELETE `/facturas.php` | Elimina una factura |
| **Exportar** |||
| `exportar.exportarFacturas()` | GET `/export.php?type=facturas` | Descarga Excel de facturas |
| `exportar.exportarProyectos()` | GET `/export.php?type=proyectos` | Descarga Excel de proyectos |

---

## 🚀 Próximos Pasos

1. **Importar la base de datos** (si aún no lo hiciste)
2. **Configurar tu IP** en `apiService.js`
3. **Probar el API** en el navegador
4. **Modificar una pantalla** (empieza con `ProyectosScreen`)
5. **Probar en tu dispositivo/emulador**

---

¿Necesitas ayuda con algún paso específico? ¡Pregunta! 😊
