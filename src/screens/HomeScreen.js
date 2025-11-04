import React from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const handleNavigateToTab = (tabName) => {
    // Navegar al tab específico
    navigation.navigate(tabName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="file-document-multiple" size={60} color={colors.primary} />
          <Text style={styles.title}>Gestor de Facturas</Text>
          <Text style={styles.subtitle}>
            Gestiona tus facturas y proyectos de manera eficiente
          </Text>
        </View>

      <View style={styles.cardsContainer}>
        <Card style={[styles.card, styles.cardPrimary]} onPress={() => navigation.navigate('NuevaFactura')}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="plus-circle" size={40} color={colors.success} />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Nueva Factura</Text>
                <Text style={styles.cardSubtitle}>Cargar una nueva factura con foto</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.cardSecondary]} onPress={() => handleNavigateToTab('Facturas')}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="file-document" size={40} color={colors.primary} />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Ver Facturas</Text>
                <Text style={styles.cardSubtitle}>Consulta todas tus facturas</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.cardAccent]} onPress={() => handleNavigateToTab('Proyectos')}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="folder-multiple" size={40} color={colors.secondary} />
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
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
          <Text style={styles.featureText}>Captura de facturas con cámara</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
          <Text style={styles.featureText}>Organización por proyectos</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
          <Text style={styles.featureText}>Filtrado y búsqueda rápida</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
          <Text style={styles.featureText}>Almacenamiento en la nube</Text>
        </View>
      </View>
      {/* Espacio adicional al final */}
      <View style={{ height: 20 }} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.backgroundCard,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    marginTop: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 10,
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 8,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardSecondary: {
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  cardAccent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
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
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoSection: {
    padding: 20,
    backgroundColor: colors.backgroundCard,
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
