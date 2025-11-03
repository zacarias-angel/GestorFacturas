import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, Modal, TextInput as RNTextInput } from 'react-native';
import { FAB, Card, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { coloresProyecto } from '../models/Proyecto';

export default function ProyectosScreen() {
  const [proyectos, setProyectos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    cargarProyectos();
  }, []);

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
    if (!nuevoProyecto.nombre || nuevoProyecto.nombre.trim().length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres');
      return;
    }

    try {
      const proyecto = {
        id: `proyecto-${Date.now()}`,
        nombre: nuevoProyecto.nombre.trim(),
        descripcion: nuevoProyecto.descripcion.trim(),
        color: coloresProyecto[Math.floor(Math.random() * coloresProyecto.length)],
        cantidadFacturas: 0,
        montoTotal: 0,
        fechaCreacion: new Date().toISOString(),
        activo: true,
      };

      const data = await AsyncStorage.getItem('@gestorFactura:proyectos');
      const proyectosObj = data ? JSON.parse(data) : {};
      proyectosObj[proyecto.id] = proyecto;
      
      await AsyncStorage.setItem('@gestorFactura:proyectos', JSON.stringify(proyectosObj));
      
      setProyectos([...proyectos, proyecto]);
      setVisible(false);
      setNuevoProyecto({ nombre: '', descripcion: '' });
      
      Alert.alert('Éxito', 'Proyecto creado correctamente');
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      Alert.alert('Error', 'No se pudo guardar el proyecto');
    }
  };

  const renderProyecto = ({ item }) => (
    <Card style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 8 }]}>
      <Card.Content>
        <Text style={styles.proyectoTitulo}>{item.nombre}</Text>
        {item.descripcion ? <Text style={styles.proyectoDescripcion}>{item.descripcion}</Text> : null}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Facturas:</Text>
            <Text style={styles.statValue}>{item.cantidadFacturas}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total:</Text>
            <Text style={styles.statValue}>${item.montoTotal.toFixed(2)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {proyectos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay proyectos aún.{'\n'}¡Crea tu primer proyecto!
          </Text>
        </View>
      ) : (
        <FlatList
          data={proyectos}
          renderItem={renderProyecto}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setVisible(true)}
      />

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
              onChangeText={(text) => setNuevoProyecto({ ...nuevoProyecto, nombre: text })}
              style={styles.input}
              placeholder="Nombre del proyecto"
            />
            
            <Text style={styles.inputLabel}>Descripción</Text>
            <RNTextInput
              value={nuevoProyecto.descripcion}
              onChangeText={(text) => setNuevoProyecto({ ...nuevoProyecto, descripcion: text })}
              style={[styles.input, styles.textArea]}
              placeholder="Descripción (opcional)"
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalActions}>
              <Button 
                mode="text" 
                onPress={() => setVisible(false)}
                style={styles.modalButton}
              >
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                onPress={guardarProyecto}
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
