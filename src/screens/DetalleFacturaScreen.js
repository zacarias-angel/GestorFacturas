import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import apiService from '../services/apiService';

export default function DetalleFacturaScreen({ route, navigation }) {
  const { factura } = route.params;
  const [loading, setLoading] = useState(false);
  const [estadoActual, setEstadoActual] = useState(factura.estado || 'pendiente');
  const [modalEstadoVisible, setModalEstadoVisible] = useState(false);

  const estados = [
    { valor: 'pendiente', label: 'Pendiente', color: '#FFA726', icon: 'clock-outline' },
    { valor: 'pagada', label: 'Pagada', color: '#66BB6A', icon: 'check-circle-outline' },
    { valor: 'cancelada', label: 'Cancelada', color: '#EF5350', icon: 'close-circle-outline' },
  ];

  const estadoInfo = estados.find(e => e.valor === estadoActual) || estados[0];

  /**
   * Cambia el estado de la factura
   */
  const cambiarEstado = async (nuevoEstado) => {
    try {
      setLoading(true);
      setModalEstadoVisible(false);

      await apiService.facturas.actualizar(factura.id, {
        estado: nuevoEstado,
      });

      setEstadoActual(nuevoEstado);
      Alert.alert('Éxito', 'Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina la factura
   */
  const eliminarFactura = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar esta factura?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiService.facturas.eliminar(factura.id);
              
              Alert.alert('Éxito', 'Factura eliminada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar la factura');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Estado */}
        <TouchableOpacity
          style={[styles.estadoBadge, { backgroundColor: estadoInfo.color }]}
          onPress={() => setModalEstadoVisible(true)}
          disabled={loading}
        >
          <MaterialCommunityIcons name={estadoInfo.icon} size={24} color="#fff" />
          <Text style={styles.estadoText}>{estadoInfo.label}</Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Información Principal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Factura</Text>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="receipt" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Número de Factura</Text>
              <Text style={styles.infoValue}>{factura.numero_factura || factura.numeroFactura}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>
                {new Date(factura.fecha).toLocaleDateString('es-AR')}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="store" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Proveedor</Text>
              <Text style={styles.infoValue}>{factura.proveedor}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="cash" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Monto</Text>
              <Text style={[styles.infoValue, styles.montoValue]}>
                ${parseFloat(factura.monto).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Concepto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Concepto</Text>
          <Text style={styles.conceptoText}>{factura.concepto}</Text>
        </View>

        {/* Proyecto */}
        {factura.proyecto_nombre && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proyecto</Text>
            <View style={styles.proyectoCard}>
              <View
                style={[
                  styles.proyectoColorBar,
                  { backgroundColor: factura.proyecto_color || '#2196F3' },
                ]}
              />
              <Text style={styles.proyectoNombre}>{factura.proyecto_nombre}</Text>
            </View>
          </View>
        )}

        {/* Notas */}
        {factura.notas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.notasText}>{factura.notas}</Text>
          </View>
        )}

        {/* Imagen */}
        {factura.imagen_uri && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Imagen de la Factura</Text>
            <Image
              source={{ uri: factura.imagen_uri }}
              style={styles.imagen}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Botón Eliminar */}
        <Button
          mode="outlined"
          onPress={eliminarFactura}
          style={styles.deleteButton}
          textColor="#EF5350"
          disabled={loading}
          icon="delete"
        >
          Eliminar Factura
        </Button>
      </ScrollView>

      {/* Modal para cambiar estado */}
      <Modal
        visible={modalEstadoVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalEstadoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Estado</Text>

            {estados.map((estado) => (
              <TouchableOpacity
                key={estado.valor}
                style={[
                  styles.estadoOption,
                  estadoActual === estado.valor && styles.estadoOptionSelected,
                ]}
                onPress={() => cambiarEstado(estado.valor)}
              >
                <MaterialCommunityIcons
                  name={estado.icon}
                  size={24}
                  color={estado.color}
                />
                <Text style={styles.estadoOptionText}>{estado.label}</Text>
                {estadoActual === estado.valor && (
                  <MaterialCommunityIcons name="check" size={24} color={estado.color} />
                )}
              </TouchableOpacity>
            ))}

            <Button
              mode="text"
              onPress={() => setModalEstadoVisible(false)}
              style={styles.modalCancelButton}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  estadoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  montoValue: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  conceptoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  proyectoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  proyectoColorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  proyectoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  notasText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  imagen: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  deleteButton: {
    marginTop: 8,
    borderColor: '#EF5350',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  estadoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    gap: 12,
  },
  estadoOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  estadoOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalCancelButton: {
    marginTop: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
