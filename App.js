import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Importar screens
import HomeScreen from './src/screens/HomeScreen';
import ListaFacturasScreen from './src/screens/ListaFacturasScreen';
import ProyectosScreen from './src/screens/ProyectosScreen';
import NuevaFacturaScreen from './src/screens/NuevaFacturaScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tema personalizado para React Native Paper
const theme = {
  colors: {
    primary: '#2196F3',
    accent: '#FF6B6B',
  },
};

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

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen 
        name="Facturas" 
        component={ListaFacturasScreen}
        options={{ title: 'Mis Facturas' }}
      />
      <Tab.Screen 
        name="Proyectos" 
        component={ProyectosScreen}
        options={{ title: 'Proyectos' }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator Principal
export default function App() {
  return (
    <PaperProvider theme={theme}>
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
          <Stack.Screen
            name="NuevaFactura"
            component={NuevaFacturaScreen}
            options={{
              title: 'Nueva Factura',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
