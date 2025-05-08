import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import RecipeGeneratorScreen from '../screens/RecipeGeneratorScreen';
import AddItemScreen from '../screens/AddItemScreen';
import MyItemsScreen from '../screens/MyItemsScreen';
// import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';  // New Recipe Detail Screen

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RecipeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RecipeGenerator"
      component={RecipeGeneratorScreen}
      options={{ headerShown: false }} // No header on this screen
    />
    <Stack.Screen
      name="RecipeDetail"
      component={RecipeDetailScreen} // The screen for displaying detailed recipe info
      options={{ title: 'Recipe Details' }} // Display back button
    />
  </Stack.Navigator>
);

const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Set icon based on route name
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'RecipeStack') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'AddItem') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'MyItems') {
              iconName = focused ? 'list' : 'list-outline';
            }

            // Return the Icon component
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3CB371', // Active tab color
          tabBarInactiveTintColor: 'gray', // Inactive tab color
          tabBarLabelStyle: { fontSize: 8.5 },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen 
          name="RecipeStack" 
          component={RecipeStack} 
          options={{ tabBarLabel: 'Recipes' }}
        />
        <Tab.Screen 
          name="AddItem" 
          component={AddItemScreen} 
          options={{ tabBarLabel: 'Add Item' }}
        />
        <Tab.Screen 
          name="MyItems" 
          component={MyItemsScreen} 
          options={{ tabBarLabel: 'My Items' }}
        />
        {/* <Tab.Screen name="BarcodeScanner" component={BarcodeScannerScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;