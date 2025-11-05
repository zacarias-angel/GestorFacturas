import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Text, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const FiltroProyectos = ({ proyectos = [], proyectoSeleccionado = null, onSeleccionar }) => {
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
  const textoBoton = proyectoSeleccionado === null
    ? '📋 Todas las facturas' 
    : `📁 ${proyectoActual?.nombre || 'Seleccionar...'}`;

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={openMenu}
        style={[
          styles.boton,
          { backgroundColor: colors.backgroundCard, borderColor: colors.border }
        ]}
        icon="filter"
        contentStyle={styles.botonContent}
        textColor={colors.text}
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
              <Text style={styles.modalTitle}>Filtrar por Proyecto</Text>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.menuList}
              contentContainerStyle={styles.menuListContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {/* Opción: Todas las facturas */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  proyectoSeleccionado === null && styles.menuItemSeleccionado,
                ]}
                onPress={() => handleSeleccionar(null)}
              >
                <MaterialCommunityIcons 
                  name="view-list" 
                  size={24} 
                  color={proyectoSeleccionado === null ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.menuItemText,
                  proyectoSeleccionado === null && styles.menuItemTextoSeleccionado,
                ]}>
                  📋 Todas las facturas
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
                        color={proyectoSeleccionado === proyecto.id ? colors.primary : colors.textSecondary} 
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          styles.menuItemText,
                          proyectoSeleccionado === proyecto.id && styles.menuItemTextoSeleccionado,
                        ]}>
                          {proyecto.nombre}
                        </Text>
                        <Text style={styles.menuItemSubtext}>
                          {proyecto.cantidad_facturas || 0} facturas
                        </Text>
                      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  boton: {
    borderWidth: 1,
  },
  botonContent: {
    justifyContent: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.backgroundCard,
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
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
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
    backgroundColor: colors.primary + '20', // 20% opacity
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  menuItemTextoSeleccionado: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  menuItemSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuItemTextDisabled: {
    fontSize: 16,
    color: colors.textSecondary,
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
    backgroundColor: colors.border,
  },
});

export default FiltroProyectos;
