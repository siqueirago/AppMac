import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginProfessor } from '../services/Api';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/LoginStyles';
import LogoImage from '../assets/portfolio.png';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      const resposta = await loginProfessor(email, senha);
      console.log('Resposta COMPLETA do login:', JSON.stringify(resposta, null, 2));

      if (resposta.success) {
        await AsyncStorage.setItem('perfilUsuario', resposta.perfil || '');
        await AsyncStorage.setItem('salaProfessor', resposta.sala || '');

        if (resposta.nome) {
          await AsyncStorage.setItem('nomeProfessor', resposta.nome);
        }

        await AsyncStorage.setItem('emailProfessor', email);
        await AsyncStorage.setItem('senhaProfessor', senha);

        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Erro', resposta.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <LinearGradient colors={['#FDE910', '#2196F3']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={LogoImage} style={styles.logo} resizeMode="cover" />
            <Text style={styles.logoText}>SISTEMA DE GERENCIAMENTO ESCOLAR</Text>
          </View>
          <Text style={styles.title}>Bem-vindo!</Text> 

          <TextInput
            style={styles.input}
            placeholder="E-mail" 
            placeholderTextColor="#888" 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#888"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          {loading ? (
            <>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          )}

          {/* Adicionei um botão de "Esqueceu a senha?" para um UX mais completo */}
          <TouchableOpacity onPress={() => Alert.alert('Ops!', 'Funcionalidade "Esqueceu a senha?" em desenvolvimento!')} style={{ marginTop: 20 }}>
            <Text style={{ color: '#ffffff', fontSize: 16, textDecorationLine: 'underline' }}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}