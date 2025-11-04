import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, SafeAreaView } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import FormularioFactura from '../components/FormularioFactura';
import apiService from '../services/apiService';

export default function NuevaFacturaScreen({ navigation }) {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarProyectos();
    solicitarPermisos();
  }, []);

  const solicitarPermisos = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se necesita permiso para acceder a la cámara');
    }
  };

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      const proyectosData = await apiService.proyectos.obtenerTodos();
      setProyectos(proyectosData);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los proyectos. Verifica la conexión.',
        [
          { text: 'Reintentar', onPress: () => cargarProyectos() },
          { text: 'Continuar sin proyectos', style: 'cancel' },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (datosFactura) => {
    try {
      setLoading(true);

      let imagenUrl = null;
      
      // Si hay una imagen, subirla primero al servidor
      if (datosFactura.imagenUri) {
        try {
          console.log('Subiendo imagen al servidor...');
          console.log('URI de imagen:', datosFactura.imagenUri);
          imagenUrl = await apiService.upload.subirImagen(datosFactura.imagenUri);
          console.log('Imagen subida:', imagenUrl);
        } catch (uploadError) {
          console.error('Error al subir imagen:', uploadError);
          console.error('Detalles del error:', uploadError);
          Alert.alert('Advertencia', 'No se pudo subir la imagen, pero se guardará la factura sin ella');
        }
      }

      // Preparar datos para el backend
      const nuevaFactura = {
        numero_factura: datosFactura.numeroFactura,
        fecha: datosFactura.fecha || new Date().toISOString().split('T')[0], // YYYY-MM-DD
        proveedor: datosFactura.proveedor,
        concepto: datosFactura.descripcion,
        monto: parseFloat(datosFactura.precioTotal || 0) + parseFloat(datosFactura.montoExtra || 0),
        proyecto_id: datosFactura.proyectoId || null,
        imagen_uri: imagenUrl || datosFactura.imagenUri || null,
        notas: datosFactura.notas || null,
        estado: 'pendiente',
      };

      console.log('Enviando factura:', nuevaFactura);

      // Enviar al backend
      const resultado = await apiService.facturas.crear(nuevaFactura);
      
      console.log('Factura creada:', resultado);

      Alert.alert('Éxito', 'Factura guardada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error al guardar factura:', error);
      console.error('Error completo:', JSON.stringify(error));
      Alert.alert(
        'Error', 
        `No se pudo guardar la factura.\n\nDetalles: ${error.message}\n\nStatus: ${error.status}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && proyectos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Cargando proyectos...</Text>
        </View>
      ) : (
        <FormularioFactura onSubmit={handleSubmit} proyectos={proyectos} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
