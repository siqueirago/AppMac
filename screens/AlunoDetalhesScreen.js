import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adicionarAnotacao } from '../services/Api';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function AlunoDetalhesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { aluno } = route.params;

  const [anotacao, setAnotacao] = useState(aluno.anotacoes || '');
  const [perfil, setPerfil] = useState('');

  useEffect(() => {
    const buscarPerfil = async () => {
      const perfilSalvo = await AsyncStorage.getItem('perfilUsuario');
      setPerfil(perfilSalvo);
    };
    buscarPerfil();
  }, []);

  const handleSalvarAnotacao = async () => {
    try {
      const resultado = await adicionarAnotacao(aluno.id, anotacao);

      if (resultado.success) {
        Alert.alert('Sucesso', resultado.message, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', resultado.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar anotação.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalhes do Aluno</Text>

      {aluno.foto ? (
        <Image source={{ uri: aluno.foto }} style={styles.image} />
      ) : (
        <Image source={require('../assets/usuario.png')} style={styles.image} />
      )}

      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.text}>{aluno.nome}</Text>

      <Text style={styles.label}>Turma:</Text>
      <Text style={styles.text}>{aluno.turma}</Text>

      <Text style={styles.label}>Escola:</Text>
      <Text style={styles.text}>{aluno.escola}</Text>

      <Text style={styles.label}>Sala:</Text>
      <Text style={styles.text}>{aluno.sala}</Text>

      <Text style={styles.label}>Anotações:</Text>
      <TextInput
        style={styles.textArea}
        value={anotacao}
        onChangeText={setAnotacao}
        placeholder="Digite suas observações..."
        multiline
        numberOfLines={6}
      />

      {(perfil === 'Professor' || perfil === 'Diretor') && (
        <Button title="Salvar" onPress={handleSalvarAnotacao} />
      )}
    </ScrollView>
  );
}

