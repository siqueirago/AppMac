import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text, // Mantenha importado
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/ProfessoresScreenStyles';
import { listarProfessores, adicionarProfessor, editarProfessor, excluirProfessor } from '../services/Api';

const ProfessoresScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');
  const [perfil, setPerfil] = useState('');
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [professorParaEditar, setProfessorParaEditar] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigation = useNavigation();

  const carregarProfessores = useCallback(() => {
    async function fetchProfessores() {
      setLoading(true);
      try {
        const data = await listarProfessores();
        if (Array.isArray(data)) {
          setProfessores(data);
        } else {
          console.warn('Dados recebidos da API não são um array:', data);
          setProfessores([]);
        }
        setProfessorParaEditar(null);
        setEmail('');
        setSenha('');
        setNome('');
        setSala('');
        setPerfil('');
        setShowForm(false);
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de professores.');
        setProfessores([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProfessores();
  }, []);

  useFocusEffect(carregarProfessores);

  const handleAdicionarProfessor = async () => {
    if (!email || !senha || !nome || !sala || !perfil) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    setLoading(true);
    try {
      const novoProfessor = { email: email.trim(), senha, nome: nome.trim(), sala: sala.trim(), perfil: perfil.trim() };
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

  const handleEditarProfessor = useCallback((professor) => {
    setProfessorParaEditar(professor);
    setEmail(professor.email);
    setNome(professor.nome);
    setSala(professor.sala);
    setPerfil(professor.perfil);
    setSenha('');
    setShowForm(true);
  }, []);

  const handleSalvarEdicaoProfessor = async () => {
    if (!email || !nome || !sala || !perfil) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!professorParaEditar || !professorParaEditar.email) {
      Alert.alert('Erro', 'Professor selecionado para edição está inválido.');
      return;
    }

    setLoading(true);
    try {
      const professorAtualizado = {
        emailOriginal: professorParaEditar.email.trim(),
        email: email.trim(),
        senha: senha,
        nome: nome.trim(),
        sala: sala.trim(),
        perfil: perfil.trim(),
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

  const handleExcluirProfessor = useCallback((emailProfessor) => {
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
  }, []);

  const renderProfessorItem = ({ item }) => (
    <View style={styles.professorItem}>
      <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>Nome:</Text> {item.nome}</Text>
      <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>Email:</Text> {item.email}</Text>
      <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>Sala:</Text> {item.sala}</Text>
      <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>Perfil:</Text> {item.perfil}</Text>
      <View style={styles.professorActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditarProfessor(item)} disabled={loading}>
          <MaterialIcons name="edit" size={18} color="#fff" style={styles.iconStyle} />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleExcluirProfessor(item.email)} disabled={loading}>
          <MaterialIcons name="delete" size={18} color="#fff" style={styles.iconStyle} />
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.scrollViewContent}>
      <Text style={styles.title}>Gerenciar Professores</Text>
      <Text style={styles.subtitle}>Gerencie os professores do sistema</Text>

      {!showForm && (
        <TouchableOpacity
          style={styles.toggleFormButton}
          onPress={() => {
            setShowForm(true);
            setProfessorParaEditar(null);
            setEmail('');
            setSenha('');
            setNome('');
            setSala('');
            setPerfil('');
          }}
          disabled={loading}
        >
          <MaterialIcons name="person-add" size={24} color="#fff" style={styles.iconStyle} />
          <Text style={styles.buttonText}>Adicionar Novo Professor</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.card}>
          <Text style={styles.formTitle}>
            {professorParaEditar ? 'Editar Professor' : 'Adicionar Novo Professor'}
          </Text>

          {professorParaEditar ? (
            <View style={styles.input}>
              <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
              {/* CORREÇÃO APLICADA AQUI: */}
              <Text style={styles.readOnlyText}>Email: {email}</Text>
            </View>
          ) : (
            <View style={styles.input}>
              <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          )}

          <View style={styles.input}>
            <MaterialIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInputStyle}
              placeholder={professorParaEditar ? 'Nova Senha (opcional)' : 'Senha'}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.input}>
            <MaterialIcons name="person" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInputStyle}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              editable={!loading}
            />
          </View>

          <View style={styles.input}>
            <MaterialIcons name="meeting-room" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInputStyle}
              placeholder="Sala (ex: A, B, Todas)"
              value={sala}
              onChangeText={setSala}
              editable={!loading}
            />
          </View>

          <View style={styles.input}>
            <MaterialIcons name="assignment-ind" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInputStyle}
              placeholder="Perfil (Professor, Diretor)"
              value={perfil}
              onChangeText={setPerfil}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={professorParaEditar ? styles.saveButton : styles.actionButton}
            onPress={professorParaEditar ? handleSalvarEdicaoProfessor : handleAdicionarProfessor}
            disabled={loading}
          >
            {loading && professorParaEditar ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons
                  name={professorParaEditar ? "save" : "person-add"}
                  size={24}
                  color="#fff"
                  style={styles.iconStyle}
                />
                <Text style={styles.buttonText}>
                  {professorParaEditar ? 'Salvar Edição' : 'Adicionar Professor'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              carregarProfessores();
            }}
            disabled={loading}
          >
            <MaterialIcons name="cancel" size={24} color="#fff" style={styles.iconStyle} />
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.listTitle}>Lista de Professores Cadastrados</Text>
      {loading && professores.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando professores...</Text>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -50}
      >
        <FlatList
          data={professores}
          keyExtractor={(item) => item.email}
          renderItem={renderProfessorItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={() => (
            !loading && (
              <Text style={[styles.subtitle, { color: '#ffffff', textAlign: 'center', marginTop: 10 }]}>
                {showForm ? 'Preencha o formulário acima para adicionar o primeiro professor!' : 'Nenhum professor cadastrado. Clique em "Adicionar Novo Professor" para começar!'}
              </Text>
            )
          )}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 0 : 50 }}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ProfessoresScreen;