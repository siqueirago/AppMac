import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { buscarAlunosPorSala } from '../services/Api';
import styles from '../styles/ListAlunosStyles';

export default function ListaAlunosPorSalaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sala } = route.params;
  const { escola } = route.params;
  const [alunosDaSala, setAlunosDaSala] = useState([]);
  const [loading, setLoading] = useState(true);


  const navegarParaAnotacoes = (aluno) => { 
    navigation.navigate('AnotacaoAlunoScreen', { aluno });
  };

  const navegarParaEdicao = (aluno) => {
    navigation.navigate('EditAlunoScreen', { aluno });
  };

  const recarregarAlunos = async () => {
    setLoading(true);
    try {
      if (sala) {
        const data = await buscarAlunosPorSala(sala);
        setAlunosDaSala(data);
      } else {
        Alert.alert('Erro', 'Nenhuma sala especificada.');
      }
    } catch (error) {
      console.error("Erro ao recarregar alunos da sala:", error);
      Alert.alert('Erro', 'Não foi possível recarregar os alunos desta sala.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      recarregarAlunos();
    });
    recarregarAlunos();
    return unsubscribe;
  }, [sala, navigation]);

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
            onPress={() => navegarParaAnotacoes(item)}
          >
            <Text style={styles.buttonText}>Avaliar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton]}
            onPress={() => navegarParaEdicao(item)}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={() => navegarParaEdicao(item)}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Aguarde um pouquinho...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{alunosDaSala[0]?.escola}</Text>
      <Text style={styles.subHeaderTitle}>Sala {sala}: {alunosDaSala.length} alunos</Text>

      {alunosDaSala.length === 0 && (
        <Text style={styles.emptyMessage}>Nenhum aluno encontrado nesta sala.</Text>
      )}

      <FlatList
        data={alunosDaSala}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
