import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarAlunos } from '../services/Api'; // Certifique-se de que este caminho está correto
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/RelatoriogeralStyles'; // Certifique-se de que este caminho está correto

export default function RelatorioGeralScreen() {
  const [loading, setLoading] = useState(true);
  const [alunos, setAlunos] = useState([]);
  const [relatorio, setRelatorio] = useState({
    totalAlunos: 0,
    alunosPorSala: {},
    alunosPorTurma: {},
    escolasComTurmas: {},
  });
  const navigation = useNavigation();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const perfilSalvo = await AsyncStorage.getItem('perfilUsuario');
      if (perfilSalvo === 'Diretor') {
        const data = await buscarAlunos();
        setAlunos(data);
      } else {
        console.warn('Usuário não autorizado a ver este relatório.');
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do relatório.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalaPress = (nomeDaSala) => {
    navigation.navigate('ListaAlunosPorSalaScreen', { sala: nomeDaSala });
  };

  const gerarRelatorio = () => {
    if (!alunos || alunos.length === 0) {
      return { totalAlunos: 0, alunosPorSala: {}, alunosPorTurma: {}, escolasComTurmas: {} };
    }

    const totalAlunos = alunos.length;
    const alunosPorSala = {};
    const alunosPorTurma = {};
    const escolasComTurmas = {};

    alunos.forEach(aluno => {
      // Contagem por Sala (geral)
      alunosPorSala[aluno.sala] = (alunosPorSala[aluno.sala] || 0) + 1;

      // Contagem por Turma (geral)
      alunosPorTurma[aluno.turma] = (alunosPorTurma[aluno.turma] || 0) + 1;

      // Contagem de Alunos por Turma em cada Escola
      if (aluno.escola && aluno.turma) {
        if (!escolasComTurmas[aluno.escola]) {
          escolasComTurmas[aluno.escola] = {};
        }
        escolasComTurmas[aluno.escola][aluno.turma] = (escolasComTurmas[aluno.escola][aluno.turma] || 0) + 1;
      }
    });

    return { totalAlunos, alunosPorSala, alunosPorTurma, escolasComTurmas };
  };

  useEffect(() => {
    const novoRelatorio = gerarRelatorio();
    setRelatorio(novoRelatorio);
  }, [alunos]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 Relatório Geral de Alunos</Text>
      


      <Text style={styles.escolaText}>{alunos[0]?.escola}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alunos por Sala:</Text>
        {Object.keys(relatorio.alunosPorSala).length > 0 ? (
          Object.entries(relatorio.alunosPorSala).map(([sala, quantidade]) => (
            <TouchableOpacity key={sala} onPress={() => handleSalaPress(sala)}>
              <Text style={styles.listItem}>🔎 Turma {alunos.find(aluno => aluno.sala === sala)?.turma}  - Sala {sala}: {quantidade} alunos</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMessage}>Nenhuma sala encontrada.</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alunos por Turma:</Text>
        {Object.keys(relatorio.alunosPorTurma).length > 0 ? (
          Object.entries(relatorio.alunosPorTurma).map(([turma, quantidade]) => (
            <Text key={turma} style={styles.listItem}>Turma {turma}: {quantidade} alunos</Text>
          ))
        ) : (
          <Text style={styles.emptyMessage}>Nenhuma turma encontrada.</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Total de Alunos na Escola: {relatorio.totalAlunos}
        </Text>
      </View>

    </ScrollView>
  );
}