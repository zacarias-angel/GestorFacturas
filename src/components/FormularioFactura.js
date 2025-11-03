import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import SelectorProyecto from './SelectorProyecto';
import CapturaImagen from './CapturaImagen';

const FormularioFactura = ({ onSubmit, facturaInicial = null, proyectos = [] }) => {
  // Asegurar que proyectos sea un array
  const listaProyectos = Array.isArray(proyectos) ? proyectos : [];
  
  const [precioTotal, setPrecioTotal] = useState(
    facturaInicial?.precioTotal?.toString() || ''
  );
  const [montoExtra, setMontoExtra] = useState(
    facturaInicial?.montoExtra?.toString() || ''
  );
  const [descripcion, setDescripcion] = useState(
    facturaInicial?.descripcion || ''
  );
  const [proyectoId, setProyectoId] = useState(
    facturaInicial?.proyectoId || ''
  );
  const [imagenUri, setImagenUri] = useState(
    facturaInicial?.imagenUri || null
  );
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!precioTotal || parseFloat(precioTotal) <= 0) {
      nuevosErrores.precioTotal = 'El precio total debe ser mayor a 0';
    }

    if (montoExtra && parseFloat(montoExtra) < 0) {
      nuevosErrores.montoExtra = 'El monto extra no puede ser negativo';
    }

    if (!descripcion || descripcion.trim().length < 5) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 5 caracteres';
    }

    // Proyecto ahora es opcional
    // if (!proyectoId) {
    //   nuevosErrores.proyectoId = 'Debe seleccionar un proyecto';
    // }

    if (!imagenUri) {
      nuevosErrores.imagen = 'Debe capturar o seleccionar una imagen';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      Alert.alert('Error', 'Por favor corrija los errores en el formulario');
      return;
    }

    setLoading(true);
    try {
      const proyectoSeleccionado = listaProyectos.find(p => p.id === proyectoId);
      
      const datosFactura = {
        precioTotal: parseFloat(precioTotal),
        montoExtra: parseFloat(montoExtra) || 0,
        descripcion: descripcion.trim(),
        proyectoId: proyectoId || null,
        proyectoNombre: proyectoSeleccionado?.nombre || 'Sin proyecto',
        proyectoColor: proyectoSeleccionado?.color || '#999',
        imagenUri,
      };

      await onSubmit(datosFactura);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la factura');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    const precio = parseFloat(precioTotal) || 0;
    const extra = parseFloat(montoExtra) || 0;
    return precio + extra;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.titulo}>
            {facturaInicial ? 'Editar Factura' : 'Nueva Factura'}
          </Text>

          {/* Precio Total */}
          <View style={styles.campoContainer}>
            <Text style={styles.label}>Precio Total *</Text>
            <TextInput
              style={[styles.input, errores.precioTotal && styles.inputError]}
              value={precioTotal}
              onChangeText={setPrecioTotal}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            {errores.precioTotal && (
              <Text style={styles.textoError}>{errores.precioTotal}</Text>
            )}
          </View>

          {/* Monto Extra */}
          <View style={styles.campoContainer}>
            <Text style={styles.label}>Monto Extra</Text>
            <TextInput
              style={[styles.input, errores.montoExtra && styles.inputError]}
              value={montoExtra}
              onChangeText={setMontoExtra}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            {errores.montoExtra && (
              <Text style={styles.textoError}>{errores.montoExtra}</Text>
            )}
          </View>

          {/* Total Calculado */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calcularTotal().toFixed(2)}</Text>
          </View>

          {/* Descripción */}
          <View style={styles.campoContainer}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errores.descripcion && styles.inputError,
              ]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción de la factura..."
              multiline
              numberOfLines={4}
            />
            {errores.descripcion && (
              <Text style={styles.textoError}>{errores.descripcion}</Text>
            )}
          </View>

          {/* Selector de Proyecto */}
          <View style={styles.campoContainer}>
            <Text style={styles.label}>Proyecto (opcional)</Text>
            <SelectorProyecto
              proyectos={listaProyectos}
              proyectoSeleccionado={proyectoId}
              onSeleccionar={setProyectoId}
            />
            {errores.proyectoId && (
              <Text style={styles.textoError}>{errores.proyectoId}</Text>
            )}
          </View>

          {/* Captura de Imagen */}
          <View style={styles.campoContainer}>
            <Text style={styles.label}>Imagen de la Factura *</Text>
            <CapturaImagen
              onImagenCapturada={setImagenUri}
              imagenInicial={imagenUri}
            />
            {errores.imagen && (
              <Text style={styles.textoError}>{errores.imagen}</Text>
            )}
          </View>

          {/* Botón Guardar */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.botonGuardar}
          >
            {facturaInicial ? 'Actualizar' : 'Guardar Factura'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  titulo: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  campoContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
  },
  inputError: {
    borderColor: '#f44336',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textoError: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  totalContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  botonGuardar: {
    marginTop: 8,
    paddingVertical: 6,
  },
});

export default FormularioFactura;
