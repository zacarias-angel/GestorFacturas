import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Importar pantallas (crear estos archivos)
// import HomeScreen from '../screens/HomeScreen';
// import ListaFacturasScreen from '../screens/ListaFacturasScreen';
// import ProyectosScreen from '../screens/ProyectosScreen';
// import NuevaFacturaScreen from '../screens/NuevaFacturaScreen';
// import DetalleFacturaScreen from '../screens/DetalleFacturaScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      {/* <Tab.Screen name="Facturas" component={ListaFacturasScreen} /> */}
      {/* <Tab.Screen name="Proyectos" component={ProyectosScreen} /> */}
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
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="NuevaFactura"
          component={NuevaFacturaScreen}
          options={{
            title: 'Nueva Factura',
            presentation: 'modal',
          }}
        /> */}
        {/* <Stack.Screen
          name="DetalleFactura"
          component={DetalleFacturaScreen}
          options={{
            title: 'Detalle de Factura',
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
