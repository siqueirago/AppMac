import React, { useEffect, useState, useCallback } from 'react'; // Adicionado useCallback
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { buscarAlunosPorSala, excluirAluno } from '../services/Api';
import styles from '../styles/ListAlunosStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function ListaAlunosPorSalaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sala, escola } = route.params;
  const [alunosDaSala, setAlunosDaSala] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // MUDANÇA AQUI: Ajuste no uso de useFocusEffect com useCallback e função async interna
  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => { // Define a função async interna
        setLoading(true);
        try {
          if (sala) {
            const data = await buscarAlunosPorSala(sala);
            if (Array.isArray(data)) {
              setAlunosDaSala(data);
            } else {
              console.warn('Dados recebidos da API para sala não são um array:', data);
              setAlunosDaSala([]);
            }
          } else {
            Alert.alert('Erro', 'Nenhuma sala especificada para carregar alunos.');
            setAlunosDaSala([]);
          }
        } catch (error) {
          console.error("Erro ao carregar alunos da sala:", error);
          Alert.alert('Erro', 'Não foi possível carregar os alunos desta sala. Verifique a conexão.');
          setAlunosDaSala([]);
        } finally {
          setLoading(false);
        }
      };

      carregarDados(); // Chama a função async imediatamente

      // Retorno de limpeza (opcional, mas boa prática se houver listeners, etc.)
      return () => {
        // Qualquer lógica de limpeza, como remover listeners
      };
    }, [sala]) // Dependência: sala
  );

  const navegarParaAnotacoes = (aluno) => {
    navigation.navigate('AnotacaoAlunoScreen', { aluno });
  };

  const navegarParaEdicao = (aluno) => {
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
                setAlunosDaSala(prevAlunos => prevAlunos.filter(aluno => aluno.id !== alunoId));
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
        <Text style={styles.turma}>{item.turma} - Sala {item.sala}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.detailsButton]}
            onPress={() => navegarParaAnotacoes(item)}
            disabled={deletingId !== null}
          >
            <Text style={styles.buttonText}>Avaliar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navegarParaEdicao(item)}
            disabled={deletingId !== null}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
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
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando alunos da sala {sala}...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!loading && alunosDaSala.length === 0) {
    return (
      <LinearGradient colors={['#FDE910', '#2196F3']} style={styles.gradientBackground}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{escola}</Text>
            <Text style={styles.subHeaderTitle}>Sala {sala}</Text>
          </View>
          <View style={styles.noStudentsContainer}>
            <MaterialIcons name="sentiment-dissatisfied" size={50} color="#ffffff" style={{ marginBottom: 10 }} />
            <Text style={styles.noStudentsText}>Nenhum aluno encontrado na Sala {sala}.</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FDE910', '#2196F3']} style={styles.gradientBackground}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{escola}</Text>
          <Text style={styles.subHeaderTitle}>Sala {sala}: {alunosDaSala.length} alunos</Text>
        </View>

        <FlatList
          data={alunosDaSala}
          keyExtractor={(item, index) => (item && item.id !== undefined && item.id !== null) ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </LinearGradient>
  );
}