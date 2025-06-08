import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'; // Importe CardStyleInterpolators
import { Easing } from 'react-native'; // Importe Easing para transições personalizadas

// Importe suas telas
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ListaAlunosScreen from '../screens/ListaAlunosScreen';
import EditAlunoScreen from '../screens/EditAlunoScreen';
import AddAlunoScreen from '../screens/AddAlunoScreen';
import AlunoDetalhesScreen from '../screens/AlunoDetalhesScreen';
import AnotacaoAlunoScreen from '../screens/AnotacaoAlunoScreen';
import ProfessoresScreen from '../screens/ProfessoresScreen';
import RelatorioGeralScreen from '../screens/RelatorioGeralScreen';
import ListaAlunosPorSalaScreen from '../screens/ListaAlunosPorSalaScreen';
import GraficosScreen from '../screens/GraficosScreen';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          // Estilo de cabeçalho padrão para todas as telas, a menos que sobrescrito
          headerStyle: {
            backgroundColor: '#2196F3', // Cor de fundo do cabeçalho (azul vibrante)
            elevation: 0, // Remove sombra no Android
            shadowOpacity: 0, // Remove sombra no iOS
            borderBottomWidth: 0, // Remove linha inferior
          },
          headerTintColor: '#ffffff', // Cor do texto e ícones do cabeçalho
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false, // Oculta o título da tela anterior no iOS
          headerTitleAlign: 'center', // Centraliza o título

          // Configurações de transição padrão para todas as telas
          // Usaremos um cardStyleInterpolator mais genérico para slide
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Transição de slide horizontal padrão do iOS
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 300, easing: Easing.out(Easing.ease) } },
            close: { animation: 'timing', config: { duration: 300, easing: Easing.in(Easing.ease) } },
          },
          gestureEnabled: true, // Habilita o gesto de voltar (swipe)
          gestureDirection: 'horizontal', // Direção do gesto
        }}
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false, // Login não terá cabeçalho
          }}
        />

        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false, // HomeScreen não terá cabeçalho, já que tem seu próprio design
            // As transições personalizadas já estavam aqui, vamos mantê-las se for o desejo
            // Ou remover para usar a transição padrão definida em screenOptions
            // Mantendo a transição personalizada de slide vertical com fade da tela anterior:
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  opacity: current.progress,
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0], // Slide de baixo para cima
                      }),
                    },
                  ],
                },
              };
            },
            gestureDirection: 'vertical', // Gesto de voltar para baixo
            gestureEnabled: true,
          }}
        />

        <Stack.Screen
          name="ListaAlunosScreen"
          component={ListaAlunosScreen}
          options={{
            title: 'Lista de Alunos', // Título que aparece no cabeçalho
          }}
        />

        <Stack.Screen
          name="AddAlunoScreen"
          component={AddAlunoScreen}
          options={{
            title: 'Adicionar Aluno', // Título para a tela de adicionar aluno
          }}
        />
        <Stack.Screen
          name="EditAlunoScreen"
          component={EditAlunoScreen}
          options={{
            title: 'Editar Aluno', // Título para a tela de editar aluno
          }}
        />
        <Stack.Screen
          name="AlunoDetalhesScreen"
          component={AlunoDetalhesScreen}
          options={{
            title: 'Detalhes do Aluno', // Título para a tela de detalhes
          }}
        />
        <Stack.Screen
          name="AnotacaoAlunoScreen"
          component={AnotacaoAlunoScreen}
          options={{
            title: 'Anotações', // Título para a tela de anotações
          }}
        />
        <Stack.Screen
          name="ProfessoresScreen"
          component={ProfessoresScreen}
          options={{
            title: 'Gerenciar Professores', // Título
          }}
        />
        <Stack.Screen
          name="RelatorioGeralScreen"
          component={RelatorioGeralScreen}
          options={{
            title: 'Relatório Geral', // Título sem o ícone no código
          }}
        />
        <Stack.Screen
          name="ListaAlunosPorSalaScreen"
          component={ListaAlunosPorSalaScreen}
          options={{
            title: 'Alunos por Sala', // Título
          }}
        />
        <Stack.Screen
          name="GraficosScreen"
          component={GraficosScreen}
          options={{
            title: 'Representação Gráfica', // Título sem o ícone no código
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


