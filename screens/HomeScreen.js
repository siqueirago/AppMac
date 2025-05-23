import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/HomeStyles';

export default function HomeScreen() {
  const [perfil, setPerfil] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState(''); // Novo estado para o nome do usuário
  const navigation = useNavigation();

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      const perfilSalvo = await AsyncStorage.getItem('perfilUsuario');
      const nomeSalvo = await AsyncStorage.getItem('nomeProfessor'); // Assumindo que 'nomeProfessor' é onde você salvou o nome
      setPerfil(perfilSalvo);
      setNomeUsuario(nomeSalvo || 'Usuário'); // Define um valor padrão caso o nome não seja encontrado
    };
    carregarDadosUsuario();
  }, []);

  const navegarParaListaAlunos = async () => {
    const nomeProf = await AsyncStorage.getItem('nomeProfessor');
    navigation.navigate('ListaAlunosScreen', { professorNome: nomeProf });
  };

  const navegarParaGerenciarProfessores = () => {
    navigation.navigate('GerenciarProfessoresScreen');
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (

    
      <ImageBackground
        source={require('../assets/tela1.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        
        <Text style={styles.title}>Bem-vindo(a)</Text>
        <Text style={styles.subTitle}>Prof.: {nomeUsuario}</Text>
        <Text style={styles.subTitle}>{new Date().toLocaleDateString()}</Text>

        <TouchableOpacity style={styles.button} onPress={navegarParaListaAlunos}>
          <Text style={styles.buttonText}>Lista de Alunos</Text>
        </TouchableOpacity>

        {perfil === 'Diretor' && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddAlunoScreen')}>
            <Text style={styles.buttonText}>Adicionar Aluno</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navegarParaGerenciarProfessores}>
            <Text style={styles.buttonText}>Gerenciar Professores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RelatorioGeralScreen')}>
            <Text style={styles.buttonText}>Relatório Geral</Text>
          </TouchableOpacity>
        </>
      )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ImageBackground>
    
  );
}