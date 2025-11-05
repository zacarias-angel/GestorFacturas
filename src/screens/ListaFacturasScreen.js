import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Text, Alert, SafeAreaView } from 'react-native';
import { FAB, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TarjetaFactura from '../components/TarjetaFactura';
import FiltroProyectos from '../components/FiltroProyectos';
import apiService from '../services/apiService';
import { colors } from '../theme/colors';

export default function ListaFacturasScreen({ navigation, route }) {
  const [facturas, setFacturas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Si viene un proyecto desde los params, establecerlo como seleccionado
  useEffect(() => {
    if (route?.params?.proyectoId) {
      setProyectoSeleccionado(route.params.proyectoId);
      // Limpiar el parámetro para que no se mantenga en futuras navegaciones
      navigation.setParams({ proyectoId: undefined, proyectoNombre: undefined });
    }
    // Después de establecer el proyecto, marcar que ya se hizo la carga inicial
    setInitialLoad(false);
  }, [route?.params?.proyectoId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar proyectos
      const proyectosData = await apiService.proyectos.obtenerTodos();
      setProyectos(proyectosData);
      
      // Cargar facturas según filtro
      let facturasData;
      if (proyectoSeleccionado) {
        facturasData = await apiService.facturas.obtenerPorProyecto(proyectoSeleccionado);
      } else {
        facturasData = await apiService.facturas.obtenerTodas();
      }
      
      setFacturas(facturasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos. Verifica la conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos cuando la pantalla recibe foco (después de la carga inicial)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!initialLoad) {
        cargarDatos();
      }
    });

    return unsubscribe;
  }, [navigation, initialLoad, proyectoSeleccionado]);

  // Cargar datos cuando cambie el proyecto seleccionado o termine la carga inicial
  useEffect(() => {
    if (!initialLoad) {
      cargarDatos();
    }
  }, [proyectoSeleccionado, initialLoad]);

  const facturasFiltradas = busqueda
    ? facturas.filter(factura =>
        (factura.concepto || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (factura.proveedor || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (factura.numero_factura || '').toLowerCase().includes(busqueda.toLowerCase())
      )
    : facturas;

  const renderFactura = ({ item }) => (
    <TarjetaFactura
      factura={{
        ...item,
        precioTotal: parseFloat(item.monto || 0),
        montoExtra: 0,
        descripcion: item.concepto,
        proyectoNombre: item.proyecto_nombre || 'Sin proyecto',
        proyectoColor: item.proyecto_color || '#999',
        fechaCreacion: item.fecha,
        estado: item.estado || 'pendiente',
      }}
      onPress={() => navigation.navigate('DetalleFactura', { factura: item })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar facturas..."
              onChangeText={setBusqueda}
              value={busqueda}
              style={styles.searchInput}
            />
            {busqueda.length > 0 && (
              <MaterialCommunityIcons 
                name="close" 
                size={20} 
                color="#666" 
                onPress={() => setBusqueda('')}
                style={styles.clearIcon}
              />
            )}
          </View>
        </View>

        <FiltroProyectos
          proyectos={proyectos}
          proyectoSeleccionado={proyectoSeleccionado}
          onSeleccionar={setProyectoSeleccionado}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              {proyectoSeleccionado 
                ? 'Filtrando facturas del proyecto...' 
                : 'Cargando facturas...'}
            </Text>
          </View>
        ) : facturasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name={facturas.length === 0 ? "file-document-outline" : "filter-off"} 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyText}>
              {facturas.length === 0 
                ? 'No hay facturas aún.\n¡Crea tu primera factura!'
                : 'No se encontraron facturas con este filtro'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={facturasFiltradas}
            renderItem={renderFactura}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshing={false}
            onRefresh={cargarDatos}
          />
        )}

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('NuevaFactura')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  clearIcon: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});
