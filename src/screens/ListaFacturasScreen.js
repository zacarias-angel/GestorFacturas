import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Text } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TarjetaFactura from '../components/TarjetaFactura';
import FiltroProyectos from '../components/FiltroProyectos';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListaFacturasScreen({ navigation }) {
  const [facturas, setFacturas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarDatos();
    
    const unsubscribe = navigation.addListener('focus', () => {
      cargarDatos();
    });

    return unsubscribe;
  }, [navigation]);

  const cargarDatos = async () => {
    try {
      const facturasData = await AsyncStorage.getItem('@gestorFactura:facturas');
      const proyectosData = await AsyncStorage.getItem('@gestorFactura:proyectos');
      
      if (facturasData) {
        const facturasObj = JSON.parse(facturasData);
        const facturasArray = Object.values(facturasObj);
        setFacturas(facturasArray);
      }
      
      if (proyectosData) {
        const proyectosObj = JSON.parse(proyectosData);
        const proyectosArray = Object.values(proyectosObj);
        setProyectos(proyectosArray);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const facturasFiltradas = facturas.filter(factura => {
    const coincideProyecto = proyectoSeleccionado 
      ? factura.proyectoId === proyectoSeleccionado 
      : true;
    
    const coincideBusqueda = busqueda
      ? factura.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    
    return coincideProyecto && coincideBusqueda;
  });

  const renderFactura = ({ item }) => (
    <TarjetaFactura
      factura={item}
      onPress={() => {}}
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

      {facturasFiltradas.length === 0 ? (
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
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
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
