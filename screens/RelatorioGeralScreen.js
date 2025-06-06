import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarAlunos } from '../services/Api';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/RelatoriogeralStyles';

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
    (async () => {
      setLoading(true);
      try {
        const perfil = await AsyncStorage.getItem('perfilUsuario');
        if (perfil === 'Diretor') {
          const data = await buscarAlunos();
          setAlunos(data);
        } else {
          console.warn('Usuário sem permissão.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do relatório.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setRelatorio(gerarRelatorio(alunos));
  }, [alunos]);

  const handleSalaPress = (sala) => {
    navigation.navigate('ListaAlunosPorSalaScreen', { sala });
  };

  const gerarRelatorio = (alunos) => {
    const totalAlunos = alunos.length;
    const alunosPorSala = {};
    const alunosPorTurma = {};
    const escolasComTurmas = {};

    alunos.forEach((aluno) => {
      alunosPorSala[aluno.sala] = (alunosPorSala[aluno.sala] || 0) + 1;
      alunosPorTurma[aluno.turma] = (alunosPorTurma[aluno.turma] || 0) + 1;

      if (aluno.escola && aluno.turma) {
        if (!escolasComTurmas[aluno.escola]) escolasComTurmas[aluno.escola] = {};
        escolasComTurmas[aluno.escola][aluno.turma] =
          (escolasComTurmas[aluno.escola][aluno.turma] || 0) + 1;
      }
    });

    return { totalAlunos, alunosPorSala, alunosPorTurma, escolasComTurmas };
  };

  const ListaCondicional = ({ titulo, dados, renderItem, emptyMessage }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{titulo}</Text>
      {Object.keys(dados).length > 0 ? (
        Object.entries(dados).map(renderItem)
      ) : (
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      )}
    </View>
  );

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
<ListaCondicional
  titulo="Alunos por Sala:"
  dados={relatorio.alunosPorSala}
  renderItem={([sala, quantidade]) => {
    const alunoDaSala = alunos.find(aluno => aluno.sala === sala);
    const escola = alunoDaSala?.escola || 'Escola não informada';

    return (
      <TouchableOpacity key={sala} onPress={() => handleSalaPress(sala)} style={styles.cardSala}>
        <View style={styles.cardHeader}>
          <Text style={styles.salaTexto}>📄 Sala {sala}</Text>
          <Text style={styles.iconeDetalhe}>🔍</Text>
        </View>
        <Text style={styles.escolaTexto}>{escola}</Text>
        <Text style={styles.quantidadeTexto}>{quantidade} aluno(s)</Text>
      </TouchableOpacity>
    );
  }}
  emptyMessage="Nenhuma sala encontrada."
/>
<ListaCondicional
        titulo="Alunos por Turma:"
        dados={relatorio.alunosPorTurma}
        renderItem={([turma, quantidade]) => (
          <View key={turma} style={styles.sectionItem}>
            <Text style={styles.listItem}>Turma {turma}: {quantidade} aluno(s)</Text>
          </View>
        )}
        emptyMessage="Nenhuma turma encontrada."
      />


      <ListaCondicional
        titulo="Escolas com Turmas:"
        dados={relatorio.escolasComTurmas}
        renderItem={([escola, turmas]) => (
          <View key={escola} style={styles.schoolContainer}>
            <Text style={styles.schoolName}>{escola}:</Text>
            {Object.entries(turmas).map(([turma, quantidade]) => (
              <Text key={turma} style={styles.listItem}>
                Turma {turma}: {quantidade} alunos
              </Text>
            ))}
          </View>
        )}
        emptyMessage="Nenhuma escola com turmas encontrada."
      />
      <ListaCondicional
        titulo="Total de Alunos:"
        dados={{ Total: relatorio.totalAlunos }}
        renderItem={([key, value]) => (
          <View key={key} style={styles.sectionItem}>
            <Text style={styles.listItem}>{key}: {value} aluno(s)</Text>
          </View>
        )}
        emptyMessage="Nenhum aluno encontrado."
      />
      

    </ScrollView>
  );
}