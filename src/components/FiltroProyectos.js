import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';

const FiltroProyectos = ({ proyectos = [], proyectoSeleccionado = null, onSeleccionar }) => {
  const handleSeleccionar = (proyectoId) => {
    // Si se selecciona el mismo proyecto, se deselecciona (muestra todos)
    if (proyectoSeleccionado === proyectoId) {
      onSeleccionar(null);
    } else {
      onSeleccionar(proyectoId);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Opción "Todos" */}
        <Chip
          selected={proyectoSeleccionado === null}
          onPress={() => onSeleccionar(null)}
          style={[
            styles.chip,
            proyectoSeleccionado === null && styles.chipSeleccionado,
          ]}
          selectedColor="#fff"
          mode="outlined"
        >
          Todos
        </Chip>

        {/* Proyectos */}
        {proyectos.map((proyecto) => (
          <Chip
            key={proyecto.id}
            selected={proyectoSeleccionado === proyecto.id}
            onPress={() => handleSeleccionar(proyecto.id)}
            style={[
              styles.chip,
              proyectoSeleccionado === proyecto.id && styles.chipSeleccionado,
              proyectoSeleccionado === proyecto.id && {
                backgroundColor: proyecto.color,
              },
            ]}
            selectedColor="#fff"
            mode="outlined"
          >
            {proyecto.nombre} ({proyecto.cantidadFacturas})
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  chip: {
    marginHorizontal: 4,
  },
  chipSeleccionado: {
    backgroundColor: '#2196F3',
  },
});

export default FiltroProyectos;
