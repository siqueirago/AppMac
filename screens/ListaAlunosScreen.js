import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { buscarAlunos, buscarAlunosPorSala, excluirAluno } from '../services/Api';
import styles from '../styles/ListAlunosStyles'; // Caminho para o novo arquivo de estilos
import { LinearGradient } from 'expo-linear-gradient'; // Importar LinearGradient

export default function ListaAlunosScreen() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState('');
  const [professorNome, setProfessorNome] = useState('');
  const [salaProfessor, setSalaProfessor] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigation = useNavigation();

  // MUDANÇA AQUI: Ajuste no uso de useFocusEffect com useCallback e função async interna
  useFocusEffect(
    useCallback(() => {
      const carregarDadosTelaAsync = async () => { // Define a função async interna
        setLoading(true);
        try {
          const perfilSalvo = await AsyncStorage.getItem('perfilUsuario');
          const sala = await AsyncStorage.getItem('salaProfessor');
          setPerfil(perfilSalvo);
          setSalaProfessor(sala || '');

          let data;
          if (perfilSalvo === 'Diretor') {
            data = await buscarAlunos();
          } else {
            data = await buscarAlunosPorSala(sala);
          }

          if (Array.isArray(data)) {
            setAlunos(data);
          } else {
            console.warn('Dados recebidos da API não são um array:', data);
            setAlunos([]);
          }
        } catch (error) {
          console.error("Erro ao carregar alunos (carregarDadosTela):", error);
          Alert.alert('Erro', 'Não foi possível carregar os alunos. Tente novamente.');
          setAlunos([]);
        } finally {
          setLoading(false);
        }
      };

      carregarDadosTelaAsync(); // Chama a função async imediatamente

      // Retorno de limpeza (opcional)
      return () => {
        // Nenhuma limpeza específica necessária aqui para este caso
      };
    }, []) // Dependências vazias, pois `perfilSalvo` e `sala` são lidas de `AsyncStorage`
  );

  // O resto do seu código permanece igual
  useEffect(() => {
    const carregarNomeProfessor = async () => {
      const nome = await AsyncStorage.getItem('nomeProfessor');
      setProfessorNome(nome || '');
    };
    carregarNomeProfessor();
  }, []);

  const irParaDetalhes = (aluno) => {
    navigation.navigate('AnotacaoAlunoScreen', { aluno: aluno, professor: professorNome });
  };

  const irParaEditar = (aluno) => {
    navigation.navigate('EditAlunoScreen', { aluno });
  };

  const handleExcluirAluno = (alunoId, alunoNome) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o aluno ${alunoNome}? Esta ação é irreversível.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            setDeletingId(alunoId);
            try {
              const resultado = await excluirAluno(alunoId);
              if (resultado.success) {
                Alert.alert('Sucesso', resultado.message);
                setAlunos(prevAlunos => prevAlunos.filter(aluno => aluno.id !== alunoId));
              } else {
                Alert.alert('Erro', resultado.message || 'Falha ao excluir aluno.');
              }
            } catch (error) {
              console.error("Erro ao excluir aluno:", error);
              Alert.alert('Erro', 'Erro ao excluir aluno. Verifique a conexão.');
            } finally {
              setDeletingId(null);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.foto ? (
        <Image source={{ uri: item.foto }} style={styles.image} />
      ) : (
        <Image source={require('../assets/usuario.png')} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.turma}>{item.turma} - {item.sala}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.detailsButton]}
            onPress={() => irParaDetalhes(item)}
            disabled={deletingId !== null}
          >
            <Text style={styles.buttonText}>Avaliar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => irParaEditar(item)}
            disabled={deletingId !== null}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          {perfil === 'Diretor' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleExcluirAluno(item.id, item.nome)}
                disabled={deletingId !== null}
              >
                {deletingId === item.id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Excluir</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#FDE910', '#2196F3']} style={styles.gradientBackground}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando alunos...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Se não houver alunos, exibe uma mensagem
  if (!loading && alunos.length === 0) {
    return (
      <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {professorNome && <Text style={styles.headerTitle}>Professor(a): {professorNome}</Text>}
            <Text style={styles.subHeaderTitle}>Nenhum aluno encontrado.</Text>
          </View>
          <View style={styles.noStudentsContainer}>
            <MaterialIcons name="sentiment-dissatisfied" size={50} color="#ffffff" style={{ marginBottom: 10 }} />
            <Text style={styles.noStudentsText}>Parece que não há alunos para exibir no momento.</Text>
            {perfil === 'Diretor' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.detailsButton, { marginTop: 20 }]}
                onPress={() => navigation.navigate('AddAlunoScreen')}
              >
                <Text style={styles.buttonText}>Adicionar Novo Aluno</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {professorNome && <Text style={styles.headerTitle}>Professor(a): {professorNome}</Text>}
          {perfil === 'Diretor' ? (
            <Text style={styles.subHeaderTitle}>Total de Alunos: {alunos.length}</Text>
          ) : (
            <Text style={styles.subHeaderTitle}>
              Alunos da Sala {salaProfessor || 'Não Definida'}: {alunos.length}
            </Text>
          )}
        </View>

        <FlatList
          data={alunos}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </LinearGradient>
  );
}