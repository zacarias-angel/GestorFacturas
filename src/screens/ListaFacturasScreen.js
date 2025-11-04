import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Text, Alert } from 'react-native';
import { FAB, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TarjetaFactura from '../components/TarjetaFactura';
import FiltroProyectos from '../components/FiltroProyectos';
import apiService from '../services/apiService';

export default function ListaFacturasScreen({ navigation }) {
  const [facturas, setFacturas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
    
    const unsubscribe = navigation.addListener('focus', () => {
      cargarDatos();
    });

    return unsubscribe;
  }, [navigation]);

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

  // Recargar cuando cambie el filtro de proyecto
  useEffect(() => {
    if (proyectos.length > 0) {
      cargarDatos();
    }
  }, [proyectoSeleccionado]);

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
      onPress={() => {
        try {
          navigation.navigate('DetalleFactura', { factura: item });
        } catch (error) {
          console.log('Error navegando:', error);
          // Intentar navegar al padre
          navigation.getParent()?.navigate('DetalleFactura', { factura: item });
        }
      }}
    />
  );

  return (
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

      {loading && facturas.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Cargando facturas...</Text>
        </View>
      ) : facturasFiltradas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {facturas.length === 0 
              ? 'No hay facturas aún.\n¡Crea tu primera factura!'
              : 'No se encontraron facturas'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={facturasFiltradas}
          renderItem={renderFactura}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={cargarDatos}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('NuevaFactura')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
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
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});
