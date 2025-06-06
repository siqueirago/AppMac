import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // <--- Importação CORRETA do Picker
import { adicionarAnotacao } from '../services/Api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Necessário para pegar o nome do professor
import styles from '../styles/AnotacaoAlunoStyles';

export default function AnotacaoAlunoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { aluno } = route.params; // 'aluno' já é um objeto com id, nome, sala, etc.

  const [anotacaoTexto, setAnotacaoTexto] = useState(aluno.anotacoes || '');
  const [salvando, setSalvando] = useState(false);
  const [nomeProfessorLogado, setNomeProfessorLogado] = useState(''); // Estado para o nome do professor logado

  // NOVOS ESTADOS PARA AS COMPETÊNCIAS
  const [competenciaLinguagens, setCompetenciaLinguagens] = useState('Em desenvolvimento');
  const [competenciaCognicao, setCompetenciaCognicao] = useState('Em desenvolvimento');
  const [competenciaSocial, setCompetenciaSocial] = useState('Em desenvolvimento');
  const [competenciaMotora, setCompetenciaMotora] = useState('Em desenvolvimento');

  const screenWidth = Dimensions.get('window').width;

  // Opções para os Pickers de competência
  const opcoesCompetencia = [
    { label: 'Em desenvolvimento', value: 'Em desenvolvimento' },
    { label: 'Bom', value: 'Bom' },
    { label: 'Ótimo', value: 'Ótimo' },
    { label: 'Excelente', value: 'Excelente' },
  ];

  useEffect(() => {
    // Carregar o nome do professor logado do AsyncStorage
    const getProfessorNome = async () => {
      const nome = await AsyncStorage.getItem('nomeProfessor');
      if (nome) {
        setNomeProfessorLogado(nome);
      }
    };
    getProfessorNome();
  }, []);

  // Exemplo fictício de dados de desempenho 
  const dadosDesempenho = {
    labels: ['Linguagem', 'Cognição', 'Social', 'Motora'],
    datasets: [
      {
        data: [5.0, 7.0, 8.0, 10.0], // Você pode querer atualizar isso com base nas competências reais
      },
    ],
  };

  const handleSalvar = async () => {
    if (!anotacaoTexto.trim()) {
      Alert.alert('Erro', 'Por favor, digite a anotação.');
      return;
    }

    setSalvando(true);
    try {
      const resposta = await adicionarAnotacao(
        aluno.id,
        anotacaoTexto,
        nomeProfessorLogado,
        aluno.nome,
        aluno.sala,
        competenciaLinguagens,
        competenciaCognicao,
        competenciaSocial,
        competenciaMotora
      );

      if (resposta.success) {
        Alert.alert('Sucesso', 'Anotação registrada com sucesso!');
        setAnotacaoTexto(''); // Limpa o campo de texto
        setCompetenciaLinguagens('Em desenvolvimento');
        setCompetenciaCognicao('Em desenvolvimento');
        setCompetenciaSocial('Em desenvolvimento');
        setCompetenciaMotora('Em desenvolvimento');
        navigation.goBack(); // Volta para a tela anterior
      } else {
        Alert.alert('Erro', resposta.message || 'Não foi possível registrar a anotação.');
      }
    } catch (error) {
      console.error("Erro ao registrar anotação:", error);
      Alert.alert('Erro', 'Erro ao registrar anotação. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.card}>
        <Image
          source={aluno.foto ? { uri: aluno.foto } : require('../assets/usuario.png')}
          style={styles.image}
        />
        <Text style={styles.nome}>{aluno.nome}</Text>
        <Text style={styles.info}>Turma: {aluno.turma}</Text>
        <Text style={styles.info}>Escola: {aluno.escola}</Text>
        <Text style={styles.info}>Sala: {aluno.sala}</Text>
        <Text style={styles.info}>Professor(a): {nomeProfessorLogado}</Text>
      </View>

      <Text style={styles.label}>Anotação Pedagógica:</Text>
      <TextInput
        style={styles.textArea}
        
        multiline
        numberOfLines={6}
        value={anotacaoTexto} // Alterado de 'anotacao' para 'anotacaoTexto' para consistência
        onChangeText={setAnotacaoTexto} // Alterado de 'setAnotacao' para 'setAnotacaoTexto'
        placeholder="Descreva observações sobre o aluno..."
      />

      <View style={styles.competenciasContainer}>
        <Text style={styles.competenciaTitle}>Avaliação de Competências:</Text>

        <Text style={styles.competenciaLabel}>Linguagens:</Text>
        <View style={styles.pickerWrapper}> 
          <Picker
            selectedValue={competenciaLinguagens}
            style={styles.picker}
            onValueChange={(itemValue) => setCompetenciaLinguagens(itemValue)}
          >
            {opcoesCompetencia.map((opcao) => (
              <Picker.Item key={opcao.value} label={opcao.label} value={opcao.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.competenciaLabel}>Cognição:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={competenciaCognicao}
            style={styles.picker}
            onValueChange={(itemValue) => setCompetenciaCognicao(itemValue)}
          >
            {opcoesCompetencia.map((opcao) => (
              <Picker.Item key={opcao.value} label={opcao.label} value={opcao.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.competenciaLabel}>Social:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={competenciaSocial}
            style={styles.picker}
            onValueChange={(itemValue) => setCompetenciaSocial(itemValue)}
          >
            {opcoesCompetencia.map((opcao) => (
              <Picker.Item key={opcao.value} label={opcao.label} value={opcao.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.competenciaLabel}>Motora:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={competenciaMotora}
            style={styles.picker}
            onValueChange={(itemValue) => setCompetenciaMotora(itemValue)}
          >
            {opcoesCompetencia.map((opcao) => (
              <Picker.Item key={opcao.value} label={opcao.label} value={opcao.value} />
            ))}
          </Picker>
        </View>
      </View>

      {salvando ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={salvando}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Desempenho do Aluno</Text>

<BarChart
  data={dadosDesempenho}
  width={screenWidth - 40}
  height={220}
  fromZero
  yAxisSuffix=""
  chartConfig={{
    backgroundColor: '#ffffff', // fundo branco
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`, // azul escuro
    labelColor: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`, // azul escuro
    style: {
      borderRadius: 8,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#003366', // azul escuro
    },
  }}
  style={{ marginVertical: 8, borderRadius: 8 }}
/>
    </ScrollView>
  );
}




