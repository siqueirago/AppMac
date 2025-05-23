import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles/EditAlunosStyles';
import { editarAluno } from '../services/Api';

export default function EditAlunoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { aluno } = route.params;

  const [nome, setNome] = useState(aluno.nome);
  const [turma, setTurma] = useState(aluno.turma);
  const [escola, setEscola] = useState(aluno.escola);
  const [sala, setSala] = useState(aluno.sala);
  const [foto, setFoto] = useState(aluno.foto);

  const handleEditar = async () => {
    if (!nome || !turma || !escola || !sala) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const resultado = await editarAluno({ id: aluno.id, nome, turma, escola, sala, foto });

      if (resultado.success) {
        Alert.alert('Sucesso', resultado.message, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', resultado.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao editar aluno.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Turma"
        value={turma}
        onChangeText={setTurma}
      />
      <TextInput
        style={styles.input}
        placeholder="Escola"
        value={escola}
        onChangeText={setEscola}
      />
      <TextInput
        style={styles.input}
        placeholder="Sala"
        value={sala}
        onChangeText={setSala}
      />

      <Button title="Salvar Alterações" onPress={handleEditar} />
    </ScrollView>
  );
}


