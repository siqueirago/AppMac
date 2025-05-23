import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listarProfessores, adicionarProfessor, editarProfessor, excluirProfessor } from '../services/Api';

const GerenciarProfessoresScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');
  const [perfil, setPerfil] = useState('');
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [professorParaEditar, setProfessorParaEditar] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const data = await listarProfessores();
      setProfessores(data);
      setProfessorParaEditar(null);
      setEmail('');
      setSenha('');
      setNome('');
      setSala('');
      setPerfil('');
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de professores.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarProfessor = async () => {
    if (!email || !senha || !nome || !sala || !perfil) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const novoProfessor = { email, senha, nome, sala, perfil };
      const resposta = await adicionarProfessor(novoProfessor);

      if (resposta.success) {
        Alert.alert('Sucesso', 'Professor adicionado com sucesso!');
        carregarProfessores();
      } else {
        Alert.alert('Erro', resposta.message || 'Erro ao adicionar professor.');
      }
    } catch (error) {
      console.error("Erro ao adicionar professor:", error);
      Alert.alert('Erro', 'Erro ao adicionar professor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarProfessor = (professor) => {
    console.log('Professor para editar:', professor);
    setProfessorParaEditar(professor);
    console.log('Professor para editar:', professor);
    setEmail(professor.email);
    setNome(professor.nome);
    setSala(professor.sala);
    setPerfil(professor.perfil);
    setSenha(''); // Limpa a senha por segurança
  };

  const handleSalvarEdicaoProfessor = async () => {
    if (!email || !nome || !sala || !perfil) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const professorAtualizado = {
        emailOriginal: professorParaEditar.email,
        email: email,
        senha: senha,
        nome: nome,
        sala: sala,
        perfil: perfil,
      };
      const resposta = await editarProfessor(professorAtualizado);

      if (resposta.success) {
        Alert.alert('Sucesso', 'Professor atualizado com sucesso!');
        carregarProfessores();
      } else {
        Alert.alert('Erro', resposta.message || 'Erro ao atualizar professor.');
      }
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      Alert.alert('Erro', 'Erro ao atualizar professor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirProfessor = (emailProfessor) => {
    Alert.alert(
      'Excluir Professor',
      `Deseja realmente excluir o professor com o email: ${emailProfessor}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const resposta = await excluirProfessor(emailProfessor);
              if (resposta.success) {
                Alert.alert('Sucesso', 'Professor excluído com sucesso!');
                carregarProfessores();
              } else {
                Alert.alert('Erro', resposta.message || 'Erro ao excluir professor.');
              }
            } catch (error) {
              console.error("Erro ao excluir professor:", error);
              Alert.alert('Erro', 'Erro ao excluir professor. Tente novamente.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderProfessorItem = ({ item }) => (
    <View style={styles.professorItem}>
      <Text>Nome: {item.nome}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Sala: {item.sala}</Text>
      <Text>Perfil: {item.perfil}</Text>
      <View style={styles.professorActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditarProfessor(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleExcluirProfessor(item.email)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Professores</Text>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{professorParaEditar ? 'Editar Professor' : 'Adicionar Novo Professor'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!professorParaEditar}
        />
        <TextInput
          style={styles.input}
          placeholder="Nova Senha (opcional)"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Sala (ex: A, B, Todas)"
          value={sala}
          onChangeText={setSala}
        />
        <TextInput
          style={styles.input}
          placeholder="Perfil (Professor, Diretor)"
          value={perfil}
          onChangeText={setPerfil}
        />
        <TouchableOpacity
          style={professorParaEditar ? styles.saveButton : styles.addButton}
          onPress={professorParaEditar ? handleSalvarEdicaoProfessor : handleAdicionarProfessor}
        >
          <Text style={styles.buttonText}>{professorParaEditar ? 'Salvar Edição' : 'Adicionar Professor'}</Text>
        </TouchableOpacity>
        {professorParaEditar && (
          <TouchableOpacity style={styles.cancelButton} onPress={() => setProfessorParaEditar(null)}>
            <Text style={styles.buttonText}>Cancelar Edição</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Lista de Professores</Text>
        <FlatList
          data={professores}
          keyExtractor={(item) => item.email}
          renderItem={renderProfessorItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e2c3c6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  professorItem: {
    padding: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  professorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GerenciarProfessoresScreen;