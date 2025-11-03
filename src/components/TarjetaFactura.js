import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';

const TarjetaFactura = ({ factura, onPress, onDelete = null }) => {
  const total = factura.precioTotal + factura.montoExtra;
  
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  const fecha = formatearFecha(factura.fechaCreacion);

  const getEstadoColor = () => {
    switch (factura.estado) {
      case 'aprobada':
        return '#4caf50';
      case 'procesada':
        return '#2196f3';
      case 'pendiente':
      default:
        return '#ff9800';
    }
  };

  const getEstadoTexto = () => {
    switch (factura.estado) {
      case 'aprobada':
        return 'Aprobada';
      case 'procesada':
        return 'Procesada';
      case 'pendiente':
      default:
        return 'Pendiente';
    }
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.proyectoContainer}>
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: factura.proyectoColor || '#999' },
              ]}
            />
            <Text style={styles.proyectoNombre}>
              {factura.proyectoNombre}
            </Text>
          </View>
          {onDelete && (
            <IconButton
              icon="delete"
              size={20}
              iconColor="#f44336"
              onPress={(e) => {
                e.stopPropagation();
                onDelete(factura.id);
              }}
            />
          )}
        </View>

        <View style={styles.contenido}>
          <View style={styles.infoContainer}>
            <Text style={styles.precio}>
              ${total.toFixed(2)}
            </Text>
            {factura.montoExtra > 0 && (
              <Text style={styles.extra}>
                (Base: ${factura.precioTotal.toFixed(2)} + Extra: $
                {factura.montoExtra.toFixed(2)})
              </Text>
            )}
          </View>

          <Text
            numberOfLines={2}
            style={styles.descripcion}
          >
            {factura.descripcion}
          </Text>

          <View style={styles.footer}>
            <Chip
              mode="flat"
              style={[styles.estadoChip, { backgroundColor: getEstadoColor() }]}
              textStyle={styles.estadoTexto}
            >
              {getEstadoTexto()}
            </Chip>
            <Text style={styles.fecha}>
              {fecha}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  proyectoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  proyectoNombre: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
  contenido: {
    gap: 8,
  },
  infoContainer: {
    marginBottom: 4,
  },
  precio: {
    fontWeight: 'bold',
    color: '#2196f3',
    fontSize: 24,
  },
  extra: {
    color: '#666',
    marginTop: 2,
    fontSize: 12,
  },
  descripcion: {
    color: '#333',
    lineHeight: 20,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  estadoChip: {
    height: 24,
  },
  estadoTexto: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fecha: {
    color: '#999',
    fontSize: 12,
  },
});

export default TarjetaFactura;
