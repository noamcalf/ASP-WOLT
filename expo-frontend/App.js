import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pages
import LoginScreen from './src/pages/loginScreen'; 
import RegistrationScreen from './src/pages/RegistrationScreen'; 
import DashboardScreen from './src/pages/DashboardScreen';
import RestaurantMenuScreen from './src/pages/RestaurantMenuScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import OwnerDashboardScreen from './src/pages/OwnerDashboardScreen';
import OwnerMenuManagerScreen from './src/pages/OwnerMenuManagerScreen';
import CheckoutScreen from './src/pages/CheckoutScreen';
import SearchResultsView from './src/pages/SearchResultsView';

// Context
import { AuthProvider, useAuth } from './src/context/authContext'; 
import { ThemeProvider } from './src/context/themeContext';
import { CartProvider } from './src/context/CartContext';

import { createDrawerNavigator } from '@react-navigation/drawer';
import NativeHeader from './src/components/NativeHeader';
import CartDrawer from './src/components/CartDrawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainStack() {
  const { user } = useAuth();
  return (
    // Define the NativeHeader (Old NavBar) as a field in the stack
    // If the user is a owner, he has more screens
    <Stack.Navigator screenOptions={{ header: (props) => <NativeHeader {...props} /> }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="RestaurantMenu" component={RestaurantMenuScreen} />
      <Stack.Screen name="Search" component={SearchResultsView} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      
      {user?.role === 'owner' && (
        <>
          <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
          <Stack.Screen name="OwnerMenuManager" component={OwnerMenuManagerScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Now we are using a async function to get the token from the mobile's memory, so until this command will end we will present an empty page
    // isLoading state is representing the time that takes to get the token
    return null; 
  }

  // If the user is not Authenticated it has only login and registration screen's
  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
      </Stack.Navigator>
    );
  }

  // If the user is Authenticated, show the full MainStack
  return (
    <Drawer.Navigator 
      drawerPosition="right" 
      drawerContent={(props) => <CartDrawer {...props} />}
      screenOptions={{ headerShown: false, swipeEnabled: false }}
    >
      <Drawer.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
  );
}

// The main app structure by tags that each represent a component out app has
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}