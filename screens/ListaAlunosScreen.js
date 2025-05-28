import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarAlunos, buscarAlunosPorSala, excluirAluno } from '../services/Api'; // Importe excluirAluno
import styles from '../styles/ListAlunosStyles'; // Certifique-se de que este caminho está correto

export default function ListaAlunosScreen() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState('');
  const [professorNome, setProfessorNome] = useState('');
  const [salaProfessor, setSalaProfessor] = useState('');
  const [deletingId, setDeletingId] = useState(null); // Novo estado: ID do aluno sendo excluído
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      carregarDadosTela();
    }, [])
  );

  useEffect(() => {
    const carregarSala = async () => {
      const sala = await AsyncStorage.getItem('salaProfessor');
      setSalaProfessor(sala || '');
    };
    carregarSala();
  }, []);

  useEffect(() => {
    const carregarNomeProfessor = async () => {
      const nome = await AsyncStorage.getItem('nomeProfessor');
      setProfessorNome(nome || '');
    };
    carregarNomeProfessor();
  }, []);

  const carregarDadosTela = async () => {
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
        
      } else {
        console.log('Dados não são um array.');
      }


      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos (carregarDadosTela):", error);
      Alert.alert('Erro', 'Não foi possível carregar os alunos.');
    } finally {
      setLoading(false);
    }
  };

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
            style={styles.detailsButton} 
            onPress={() => irParaDetalhes(item)}
            disabled={deletingId !== null}
          >
            <Text style={styles.buttonText}>Anotar</Text>
          </TouchableOpacity>

          {perfil === 'Diretor' && (
            <>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => irParaEditar(item)}
                disabled={deletingId !== null}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton} // Usando estilo local para exclusão
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Espere um pouquinho...</Text>
      </View>
    );
  }

  const getContagemAlunos = () => {
    if (perfil === 'Diretor') {
      return <Text style={styles.subHeaderTitle}>Total de Alunos: {alunos.length}</Text>;
    } else if (perfil === 'Professor' && salaProfessor) {
      const alunosDaSala = alunos.filter(aluno => aluno.sala === salaProfessor);
      return <Text style={styles.headerTitle}>Sala {salaProfessor}: {alunosDaSala.length} Alunos</Text>;
    } else {
      return <Text style={styles.subHeaderTitle}>Lista de Alunos</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {professorNome && <Text style={styles.headerTitle}>Professor(a): {professorNome}</Text>}
      <Text style={styles.alunoCount}>{getContagemAlunos()}</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item, index) => (item && item.id !== undefined && item.id !== null) ? item.id.toString() : index.toString()} // <--- AJUSTADO PARA SER MAIS ROBUSTO
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

