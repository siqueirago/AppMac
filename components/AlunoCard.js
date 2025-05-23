import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function AlunoCard({ aluno, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(aluno)}>
      <Image source={{ uri: aluno.foto }} style={styles.foto} />
      <View>
        <Text style={styles.nome}>{aluno.nome}</Text>
        <Text style={styles.turma}>{aluno.turma}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#e1bee7',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  foto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  turma: {
    fontSize: 14,
    color: '#555',
  },
});