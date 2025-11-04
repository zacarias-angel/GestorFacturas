import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

// Importar pantallas
import HomeScreen from '../screens/HomeScreen';
import ListaFacturasScreen from '../screens/ListaFacturasScreen';
import ProyectosScreen from '../screens/ProyectosScreen';
import NuevaFacturaScreen from '../screens/NuevaFacturaScreen';
import DetalleFacturaScreen from '../screens/DetalleFacturaScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const FacturasStack = createStackNavigator();

// Stack Navigator para Facturas
function FacturasStackScreen() {
  return (
    <FacturasStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
        },
      }}
    >
      <FacturasStack.Screen
        name="ListaFacturas"
        component={ListaFacturasScreen}
        options={{ title: 'Mis Facturas' }}
      />
      <FacturasStack.Screen
        name="DetalleFactura"
        component={DetalleFacturaScreen}
        options={{ title: 'Detalle de Factura' }}
      />
    </FacturasStack.Navigator>
  );
}

// Tab Navigator Principal
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Facturas') {
            iconName = focused ? 'file-document' : 'file-document-outline';
          } else if (route.name === 'Proyectos') {
            iconName = focused ? 'folder' : 'folder-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.backgroundCard,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Facturas" component={FacturasStackScreen} options={{ title: 'Mis Facturas' }} />
      <Tab.Screen name="Proyectos" component={ProyectosScreen} options={{ title: 'Proyectos' }} />
    </Tab.Navigator>
  );
}

// Stack Navigator Principal
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NuevaFactura"
          component={NuevaFacturaScreen}
          options={{
            title: 'Nueva Factura',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: colors.backgroundCard,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
