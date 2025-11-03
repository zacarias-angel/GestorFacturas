import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormularioFactura from '../components/FormularioFactura';

export default function NuevaFacturaScreen({ navigation }) {
  const [proyectos, setProyectos] = useState([]);

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

  const handleSubmit = async (datosFactura) => {
    try {
      const factura = {
        id: `factura-${Date.now()}`,
        ...datosFactura,
        pdfUri: '',
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        estado: 'pendiente',
      };

      const facturasData = await AsyncStorage.getItem('@gestorFactura:facturas');
      const facturasObj = facturasData ? JSON.parse(facturasData) : {};
      facturasObj[factura.id] = factura;
      await AsyncStorage.setItem('@gestorFactura:facturas', JSON.stringify(facturasObj));

      // Solo actualizar proyecto si hay uno seleccionado
      if (factura.proyectoId) {
        const proyectosData = await AsyncStorage.getItem('@gestorFactura:proyectos');
        if (proyectosData) {
          const proyectosObj = JSON.parse(proyectosData);
          if (proyectosObj[factura.proyectoId]) {
            proyectosObj[factura.proyectoId].cantidadFacturas += 1;
            proyectosObj[factura.proyectoId].montoTotal += factura.precioTotal + factura.montoExtra;
            await AsyncStorage.setItem('@gestorFactura:proyectos', JSON.stringify(proyectosObj));
          }
        }
      }

      Alert.alert('Éxito', 'Factura guardada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error al guardar factura:', error);
      Alert.alert('Error', 'No se pudo guardar la factura');
    }
  };

  return <FormularioFactura onSubmit={handleSubmit} proyectos={proyectos} />;
}

const styles = StyleSheet.create({});
