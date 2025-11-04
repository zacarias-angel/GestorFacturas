import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, Modal, TextInput as RNTextInput } from 'react-native';
import { FAB, Card, Button, ActivityIndicator } from 'react-native-paper';
import { coloresProyecto } from '../models/Proyecto';
import apiService from '../services/apiService';

export default function ProyectosScreen({ navigation }) {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    cargarProyectos();
  }, []);

  // Recargar cuando la pantalla reciba foco (después de crear facturas)
  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      cargarProyectos();
    });
    return unsubscribe;
  }, [navigation]);

  /**
   * Carga proyectos desde el backend
   */
  const cargarProyectos = async () => {
    try {
      setLoading(true);
      const proyectosData = await apiService.proyectos.obtenerTodos();
      setProyectos(proyectosData);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      Alert.alert(
        'Error de conexión',
        'No se pudieron cargar los proyectos. Verifica que el servidor esté corriendo.\n\n' + error.message,
        [
          { text: 'Reintentar', onPress: () => cargarProyectos() },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guarda un nuevo proyecto en el backend
   */
  const guardarProyecto = async () => {
    if (!nuevoProyecto.nombre || nuevoProyecto.nombre.trim().length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres');
      return;
    }

    try {
      setLoading(true);

      // Prepara los datos
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

  /**
   * Elimina un proyecto (soft delete)
   */
  const eliminarProyecto = async (proyecto) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar el proyecto "${proyecto.nombre}"?\n\nLas facturas asociadas NO se eliminarán.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiService.proyectos.eliminar(proyecto.id);

              // Actualiza la lista local
              setProyectos(proyectos.filter(p => p.id !== proyecto.id));

              Alert.alert('Éxito', 'Proyecto eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar proyecto:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar el proyecto');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Renderiza una tarjeta de proyecto
   */
  const renderProyecto = ({ item }) => (
    <Card 
      style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 8 }]}
      onLongPress={() => eliminarProyecto(item)}
    >
      <Card.Content>
        <Text style={styles.proyectoTitulo}>{item.nombre}</Text>
        {item.descripcion ? (
          <Text style={styles.proyectoDescripcion}>{item.descripcion}</Text>
        ) : null}
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Facturas:</Text>
            <Text style={styles.statValue}>{item.cantidad_facturas || 0}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total:</Text>
            <Text style={styles.statValue}>
              ${parseFloat(item.monto_total || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={styles.hint}>Mantén presionado para eliminar</Text>
      </Card.Content>
    </Card>
  );

  // Muestra indicador de carga
  if (loading && proyectos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando proyectos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {proyectos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay proyectos aún.{'\n'}¡Crea tu primer proyecto!
          </Text>
          <Button 
            mode="contained" 
            onPress={() => setVisible(true)}
            style={styles.emptyButton}
          >
            Crear Proyecto
          </Button>
        </View>
      ) : (
        <FlatList
          data={proyectos}
          renderItem={renderProyecto}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={cargarProyectos}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setVisible(true)}
        disabled={loading}
      />

      {/* Modal para crear proyecto */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Proyecto</Text>

            <Text style={styles.inputLabel}>Nombre *</Text>
            <RNTextInput
              value={nuevoProyecto.nombre}
              onChangeText={(text) =>
                setNuevoProyecto({ ...nuevoProyecto, nombre: text })
              }
              style={styles.input}
              placeholder="Nombre del proyecto"
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Descripción</Text>
            <RNTextInput
              value={nuevoProyecto.descripcion}
              onChangeText={(text) =>
                setNuevoProyecto({ ...nuevoProyecto, descripcion: text })
              }
              style={[styles.input, styles.textArea]}
              placeholder="Descripción (opcional)"
              multiline
              numberOfLines={3}
              editable={!loading}
            />

            <View style={styles.modalActions}>
              <Button
                mode="text"
                onPress={() => {
                  setVisible(false);
                  setNuevoProyecto({ nombre: '', descripcion: '' });
                }}
                disabled={loading}
                style={styles.modalButton}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={guardarProyecto}
                loading={loading}
                disabled={loading}
                style={styles.modalButton}
              >
                Guardar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  proyectoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  proyectoDescripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
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
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  modalButton: {
    minWidth: 80,
  },
});
