import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Easing } from 'react-native'; // <--- ADICIONE ESTA LINHA!

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ListaAlunosScreen from '../screens/ListaAlunosScreen';
import EditAlunoScreen from '../screens/EditAlunoScreen';
import AddAlunoScreen from '../screens/AddAlunoScreen';
import AlunoDetalhesScreen from '../screens/AlunoDetalhesScreen';
import AnotacaoAlunoScreen from '../screens/AnotacaoAlunoScreen';
import GerenciarProfessoresScreen from '../screens/GerenciarProfessoresScreen';
import RelatorioGeralScreen from '../screens/RelatorioGeralScreen';
import ListaAlunosPorSalaScreen from '../screens/ListaAlunosPorSalaScreen';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#fff',
            headerBackTitleVisible: false,

            ...TransitionPresets.FadeTransition,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  opacity: current.progress,
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
            gestureDirection: 'vertical',
            gestureEnabled: true,

          }}
        />
        <Stack.Screen name="ListaAlunosScreen" component={ListaAlunosScreen} options={{ title: 'Lista de Alunos' }} />
        <Stack.Screen name="AddAlunoScreen" component={AddAlunoScreen} options={{ title: '' }} />
        <Stack.Screen name="EditAlunoScreen" component={EditAlunoScreen} options={{ title: '' }} />
        <Stack.Screen name="AlunoDetalhesScreen" component={AlunoDetalhesScreen} options={{ title: '' }} />
        <Stack.Screen name="AnotacaoAlunoScreen" component={AnotacaoAlunoScreen} options={{ title: '' }} />
        <Stack.Screen name="GerenciarProfessoresScreen" component={GerenciarProfessoresScreen} options={{ title: '' }} />
        <Stack.Screen name="RelatorioGeralScreen" component={RelatorioGeralScreen} options={{ title: '' }} />
        <Stack.Screen name="ListaAlunosPorSalaScreen" component={ListaAlunosPorSalaScreen} options={{ title: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


