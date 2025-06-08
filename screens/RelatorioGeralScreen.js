import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { View, Text, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarAlunos } from '../services/Api';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Adicionado useFocusEffect
// IMPORTANTE: Mude esta linha para importar o novo estilo
import styles from '../styles/RelatoriogeralStyles'; // Caminho para o novo arquivo de estilos
import { LinearGradient } from 'expo-linear-gradient'; // Importar LinearGradient
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Importar ícones

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

  // Use useFocusEffect para recarregar os dados quando a tela estiver em foco
  useFocusEffect(
    useCallback(() => {
      const carregarDadosRelatorio = async () => {
        setLoading(true);
        try {
          const perfil = await AsyncStorage.getItem('perfilUsuario');
          if (perfil === 'Diretor') {
            const data = await buscarAlunos();
            if (Array.isArray(data)) {
              setAlunos(data);
            } else {
              console.warn('Dados da API para relatório não são um array:', data);
              setAlunos([]);
            }
          } else {
            Alert.alert('Acesso Negado', 'Você não tem permissão para acessar este relatório.');
            navigation.goBack();
          }
        } catch (error) {
          console.error('Erro ao carregar alunos para relatório:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados do relatório. Verifique sua conexão.');
        } finally {
          setLoading(false);
        }
      };

      carregarDadosRelatorio();

      return () => {
        // Limpeza, se necessário (ex: cancelar subscriptions)
      };
    }, []) // Dependências vazias, pois o perfil é lido do AsyncStorage aqui
  );

  useEffect(() => {
    // Garante que o relatório é gerado sempre que a lista de alunos muda
    setRelatorio(gerarRelatorio(alunos));
  }, [alunos]);

  const handleSalaPress = (sala) => {
    // Encontre a escola associada a essa sala para passar para a próxima tela
    const alunoDaSala = alunos.find(aluno => aluno.sala === sala);
    const escolaAssociada = alunoDaSala?.escola || 'Não Informada'; // Fallback

    navigation.navigate('ListaAlunosPorSalaScreen', { sala, escola: escolaAssociada });
  };

  const gerarRelatorio = (alunosData) => { // Renomeado para evitar conflito com 'alunos' do estado
    const totalAlunos = alunosData.length;
    const alunosPorSala = {};
    const alunosPorTurma = {};
    const escolasComTurmas = {};

    alunosData.forEach((aluno) => {
      if (aluno.sala) { // Verifica se a sala existe
        alunosPorSala[aluno.sala] = (alunosPorSala[aluno.sala] || 0) + 1;
      }
      if (aluno.turma) { // Verifica se a turma existe
        alunosPorTurma[aluno.turma] = (alunosPorTurma[aluno.turma] || 0) + 1;
      }

      if (aluno.escola && aluno.turma) {
        if (!escolasComTurmas[aluno.escola]) escolasComTurmas[aluno.escola] = {};
        escolasComTurmas[aluno.escola][aluno.turma] =
          (escolasComTurmas[aluno.escola][aluno.turma] || 0) + 1;
      }
    });

    // Ordenar salas e turmas para exibição consistente
    const sortedAlunosPorSala = Object.fromEntries(
      Object.entries(alunosPorSala).sort(([a], [b]) => a.localeCompare(b))
    );
    const sortedAlunosPorTurma = Object.fromEntries(
      Object.entries(alunosPorTurma).sort(([a], [b]) => a.localeCompare(b))
    );

    return { totalAlunos, alunosPorSala: sortedAlunosPorSala, alunosPorTurma: sortedAlunosPorTurma, escolasComTurmas };
  };

  const ListaCondicional = ({ titulo, dados, renderItem, emptyMessage, icon }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {icon && <MaterialIcons name={icon} size={24} color="#333" />}
        <Text style={styles.sectionTitleText}>{titulo}</Text>
      </Text>
      {Object.keys(dados).length > 0 ? (
        Object.entries(dados).map(renderItem)
      ) : (
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Preparando o relatório...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Relatório Geral de Alunos</Text>

        <ListaCondicional
          titulo="Alunos por Sala:"
          icon="meeting-room" // Ícone para salas
          dados={relatorio.alunosPorSala}
          renderItem={([sala, quantidade]) => {
            const alunoDaSala = alunos.find(aluno => aluno.sala === sala);
            const escola = alunoDaSala?.escola || 'Não Informada';

            return (
              <TouchableOpacity key={sala} onPress={() => handleSalaPress(sala)} style={styles.cardSala}>
                <View style={styles.cardHeader}>
                  <Text style={styles.salaTexto}>Sala {sala}</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#2196F3" />
                </View>
                <Text style={styles.escolaTexto}>Escola: {escola}</Text>
                <Text style={styles.quantidadeTexto}>Total: {quantidade} aluno(s)</Text>
              </TouchableOpacity>
            );
          }}
          emptyMessage="Nenhum dado de sala encontrado."
        />

        <ListaCondicional
          titulo="Alunos por Turma:"
          icon="group" // Ícone para turmas
          dados={relatorio.alunosPorTurma}
          renderItem={([turma, quantidade]) => (
            <View key={turma} style={styles.sectionItem}>
              <Text style={styles.listItem}>Turma {turma}: {quantidade} aluno(s)</Text>
            </View>
          )}
          emptyMessage="Nenhum dado de turma encontrado."
        />

        <ListaCondicional
          titulo="Escolas com Turmas:"
          icon="school" // Ícone para escolas
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
          titulo="Total Geral de Alunos:"
          icon="people" // Ícone para total de alunos
          dados={{ Total: relatorio.totalAlunos }}
          renderItem={([key, value]) => (
            <View key={key} style={styles.sectionItem}>
              <Text style={styles.listItem}>Total de Alunos Cadastrados: {value}</Text>
            </View>
          )}
          emptyMessage="Nenhum aluno cadastrado."
        />
      </ScrollView>
    </LinearGradient>
  );
}