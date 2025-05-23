import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert, ActivityIndicator, Image, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginProfessor } from '../services/Api';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/LoginStyles';
import LogoImage from '../assets/portfolio.png'; // Importe a sua imagem de logo

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

        } else {
        }
        await AsyncStorage.setItem('emailProfessor', email);
        await AsyncStorage.setItem('senhaProfessor', senha);
        //Alert.alert('Sucesso', 'Login realizado com sucesso!');
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
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Ajuste este valor conforme necessário
  >
    <View style={styles.logoContainer}>
      
      <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
    </View>
    <Text style={styles.logoText}>SISTEMA DE GERENCIAMENTO ESCOLAR</Text>
    <Text style={styles.title}>Login</Text>

    <TextInput
      style={styles.input}
      placeholder="📧 Email"
      value={email}
      onChangeText={setEmail}
      autoCapitalize="none"
      keyboardType="email-address"
    />

    <TextInput
      style={styles.input}
      placeholder="🔒 Senha"
      value={senha}
      onChangeText={setSenha}
      secureTextEntry
    />

    {loading ? (
      <>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </>
    ) : (
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    )}
  </KeyboardAvoidingView>
);
}