import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const handleNavigateToTab = (tabName) => {
    // Navegar al tab específico
    navigation.navigate(tabName);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="file-document-multiple" size={60} color="#2196F3" />
        <Text style={styles.title}>Gestor de Facturas</Text>
        <Text style={styles.subtitle}>
          Gestiona tus facturas y proyectos de manera eficiente
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <Card style={styles.card} onPress={() => navigation.navigate('NuevaFactura')}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="plus-circle" size={40} color="#4caf50" />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Nueva Factura</Text>
                <Text style={styles.cardSubtitle}>Cargar una nueva factura con foto</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => handleNavigateToTab('Facturas')}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="file-document" size={40} color="#2196F3" />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Ver Facturas</Text>
                <Text style={styles.cardSubtitle}>Consulta todas tus facturas</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => handleNavigateToTab('Proyectos')}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="folder-multiple" size={40} color="#ff9800" />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Proyectos</Text>
                <Text style={styles.cardSubtitle}>Organiza por proyectos</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Características</Text>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#4caf50" />
          <Text style={styles.featureText}>Captura de facturas con cámara</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#4caf50" />
          <Text style={styles.featureText}>Organización por proyectos</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#4caf50" />
          <Text style={styles.featureText}>Filtrado y búsqueda rápida</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#4caf50" />
          <Text style={styles.featureText}>Almacenamiento local seguro</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginTop: 15,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#555',
  },
});
