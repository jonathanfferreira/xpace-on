import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PlaySquare, Award, User } from 'lucide-react-native';

// Telas Criadas
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ClassScreen from '../screens/ClassScreen';
import LibraryScreen from '../screens/LibraryScreen';
import RankingScreen from '../screens/RankingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Telas Dummy para V2
function DummyScreen({ title }) {
    return (
        <View className="flex-1 bg-black items-center justify-center">
            <Text className="text-white font-bold tracking-widest uppercase">{title} (Em Breve)</Text>
        </View>
    );
}

// Navegação das Abas Principais
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#020202',
                    borderTopColor: '#151515',
                    paddingTop: 5,
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarActiveTintColor: '#eb00bc', // Tema Secondary
                tabBarInactiveTintColor: '#555',
                tabBarLabelStyle: {
                    fontFamily: 'sans-serif', // fallback até integrarmos as fontes custom
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                }
            }}
        >
            <Tab.Screen
                name="HoloDeck"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Holo-Deck',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Acessos"
                component={LibraryScreen}
                options={{
                    tabBarLabel: 'Biblioteca',
                    tabBarIcon: ({ color, size }) => <PlaySquare color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Ranking"
                component={RankingScreen}
                options={{
                    tabBarLabel: 'Ranking',
                    tabBarIcon: ({ color, size }) => <Award color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'SISTEMA',
                    tabBarIcon: ({ color, size }) => <User color={color} size={24} />
                }}
            />
        </Tab.Navigator>
    );
}

// Navegação Raiz (Stack contendo Login e depois as Tabs)
export default function AppNavigator() {
    // Tema escuro focado puramente em forçar o background no Nav Container
    const xPaceTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: '#000000',
            card: '#0a0a0a',
        },
    };

    return (
        <NavigationContainer theme={xPaceTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="Class" component={ClassScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
