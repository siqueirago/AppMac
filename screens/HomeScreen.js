import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/HomeStyles'; 
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [perfil, setPerfil] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      const perfilSalvo = await AsyncStorage.getItem('perfilUsuario');
      const nomeSalvo = await AsyncStorage.getItem('nomeProfessor');
      setPerfil(perfilSalvo);
      setNomeUsuario(nomeSalvo || 'Usuário');
    };
    carregarDadosUsuario();
  }, []);

  const navegarParaListaAlunos = async () => {
    const nomeProf = await AsyncStorage.getItem('nomeProfessor');
    navigation.navigate('ListaAlunosScreen', { professorNome: nomeProf });
  };

  const navegarParaProfessores = () => {
    navigation.navigate('ProfessoresScreen');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    // Adicionando LinearGradient como o fundo principal
    <LinearGradient colors={['#FDE910', '#2196F3']} style={styles.gradientBackground}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Olá,</Text>
          <Text style={styles.title}>{nomeUsuario}!</Text>
          <Text style={styles.subTitle}>{new Date().toLocaleDateString('pt-BR')}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={navegarParaListaAlunos}>
          <Text style={styles.buttonText}>Lista de Alunos</Text>
        </TouchableOpacity>

        {perfil === 'Diretor' && (
          <>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddAlunoScreen')}>
              <Text style={styles.buttonText}>Adicionar Aluno</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={navegarParaProfessores}>
              <Text style={styles.buttonText}>Professores</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RelatorioGeralScreen')}>
              <Text style={styles.buttonText}>Relatório Geral</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GraficosScreen')}>
              <Text style={styles.buttonText}>Gráficos</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={30} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}