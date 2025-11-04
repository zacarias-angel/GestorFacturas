import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const CapturaImagen = ({ onImagenCapturada, imagenInicial = null }) => {
  const [imagenUri, setImagenUri] = useState(imagenInicial);

  const tomarFoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImagenUri(uri);
        onImagenCapturada(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImagenUri(uri);
        onImagenCapturada(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const handleEliminar = () => {
    Alert.alert(
      'Eliminar imagen',
      '¿Está seguro de eliminar esta imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setImagenUri(null);
            onImagenCapturada(null);
          },
        },
      ]
    );
  };

  const mostrarOpciones = () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        { text: 'Tomar foto', onPress: tomarFoto },
        { text: 'Elegir de galería', onPress: seleccionarImagen },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {imagenUri ? (
        <View>
          <TouchableOpacity onPress={mostrarOpciones}>
            <Image source={{ uri: imagenUri }} style={styles.imagen} />
          </TouchableOpacity>
          <View style={styles.botonesContainer}>
            <Button
              mode="outlined"
              onPress={mostrarOpciones}
              style={styles.boton}
              icon="camera"
            >
              Cambiar
            </Button>
            <Button
              mode="outlined"
              onPress={handleEliminar}
              style={styles.boton}
              icon="delete"
              textColor="#f44336"
            >
              Eliminar
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.sinImagen}>
          <Text style={styles.textoSinImagen}>
            No hay imagen seleccionada
          </Text>
          <Button
            mode="contained"
            onPress={mostrarOpciones}
            style={styles.botonCapturar}
            icon="camera"
          >
            Capturar/Seleccionar Imagen
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  boton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sinImagen: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  textoSinImagen: {
    color: '#999',
    marginBottom: 16,
    fontSize: 14,
  },
  botonCapturar: {
    marginTop: 8,
  },
});

export default CapturaImagen;
