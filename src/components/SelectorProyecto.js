import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Text, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SelectorProyecto = ({ proyectos = [], proyectoSeleccionado = '', onSeleccionar }) => {
  const [visible, setVisible] = React.useState(false);

  // Asegurar que proyectos sea un array
  const listaProyectos = Array.isArray(proyectos) ? proyectos : [];

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSeleccionar = (proyectoId) => {
    onSeleccionar(proyectoId);
    closeMenu();
  };

  const proyectoActual = listaProyectos.find(p => p.id === proyectoSeleccionado);
  const textoBoton = proyectoSeleccionado === null || proyectoSeleccionado === ''
    ? 'Sin proyecto (Gasto general)' 
    : proyectoActual?.nombre || 'Seleccionar proyecto...';

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={openMenu}
        style={[
          styles.boton,
          proyectoActual && { borderColor: proyectoActual.color },
        ]}
        icon="folder"
        contentStyle={styles.botonContent}
      >
        {textoBoton}
      </Button>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeMenu}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={closeMenu}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Proyecto</Text>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.menuList}
              contentContainerStyle={styles.menuListContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {/* Opción: Sin proyecto */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  (proyectoSeleccionado === '' || proyectoSeleccionado === null) && styles.menuItemSeleccionado,
                ]}
                onPress={() => handleSeleccionar('')}
              >
                <MaterialCommunityIcons 
                  name="folder-off" 
                  size={24} 
                  color={(proyectoSeleccionado === '' || proyectoSeleccionado === null) ? '#2196F3' : '#666'} 
                />
                <Text style={[
                  styles.menuItemText,
                  (proyectoSeleccionado === '' || proyectoSeleccionado === null) && styles.menuItemTextoSeleccionado,
                ]}>
                  Sin proyecto (Gasto general)
                </Text>
              </TouchableOpacity>

              {listaProyectos.length > 0 && <View style={styles.divider} />}

              {/* Lista de proyectos */}
              {listaProyectos.length === 0 ? (
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemTextDisabled}>No hay proyectos disponibles</Text>
                </View>
              ) : (
                listaProyectos.map((proyecto, index) => (
                  <View key={proyecto.id}>
                    <TouchableOpacity
                      style={[
                        styles.menuItem,
                        proyectoSeleccionado === proyecto.id && styles.menuItemSeleccionado,
                      ]}
                      onPress={() => handleSeleccionar(proyecto.id)}
                    >
                      <View 
                        style={[styles.colorIndicator, { backgroundColor: proyecto.color }]} 
                      />
                      <MaterialCommunityIcons 
                        name="folder" 
                        size={24} 
                        color={proyectoSeleccionado === proyecto.id ? '#2196F3' : '#666'} 
                      />
                      <Text style={[
                        styles.menuItemText,
                        proyectoSeleccionado === proyecto.id && styles.menuItemTextoSeleccionado,
                      ]}>
                        {proyecto.nombre}
                      </Text>
                    </TouchableOpacity>
                    {index < listaProyectos.length - 1 && <View style={styles.divider} />}
                  </View>
                ))
              )}
              {/* Espacio adicional al final */}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  boton: {
    marginTop: 4,
    borderWidth: 2,
  },
  botonContent: {
    justifyContent: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  menuList: {
    flexGrow: 0,
  },
  menuListContent: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemSeleccionado: {
    backgroundColor: '#e3f2fd',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  menuItemTextoSeleccionado: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  menuItemTextDisabled: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default SelectorProyecto;
