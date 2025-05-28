import React, { useState, useEffect } from 'react'; // Adicione useEffect
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'; // Adicione Image, TouchableOpacity, ActivityIndicator
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles/EditAlunosStyles';
import { editarAluno, uploadFoto } from '../services/Api'; // Importe uploadFoto
import * as ImagePicker from 'expo-image-picker'; // Importe ImagePicker

export default function EditAlunoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { aluno } = route.params;

  const [nome, setNome] = useState(aluno.nome);
  const [turma, setTurma] = useState(aluno.turma);
  const [escola, setEscola] = useState(aluno.escola);
  const [sala, setSala] = useState(aluno.sala);
  const [foto, setFoto] = useState(aluno.foto); // Estado para a URL da foto
  const [uploading, setUploading] = useState(false); // Novo estado para controlar o carregamento da imagem

  // Solicitar permissões de mídia ao carregar a tela
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Desculpe, precisamos de permissão para acessar sua galeria!');
        }
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert('Permissão necessária', 'Desculpe, precisamos de permissão para acessar sua câmera!');
        }
      }
    })();
  }, []);

  // Função para escolher imagem da galeria
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduzir a qualidade para upload mais rápido
      base64: true, // Importante para enviar como Base64 para o Apps Script
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        // Assume que a imagem Base64 é o primeiro asset retornado
        const base64Img = result.assets[0].base64;
        const uploadResult = await uploadFoto(base64Img); // Chama a função de upload
        
        if (uploadResult.success && uploadResult.url) {
          setFoto(uploadResult.url); // Atualiza o estado 'foto' com a URL retornada
          Alert.alert('Sucesso', 'Foto enviada com sucesso!');
        } else {
          Alert.alert('Erro', uploadResult.message || 'Falha ao enviar a foto.');
        }
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        Alert.alert('Erro', 'Não foi possível fazer upload da foto. Verifique a conexão.');
      } finally {
        setUploading(false);
      }
    } else if (result.canceled) {
        // Usuário cancelou a seleção da imagem
        Alert.alert('Cancelado', 'Seleção de imagem cancelada.');
    }
  };

  // Função para tirar foto com a câmera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true, // Importante para enviar como Base64
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        const base64Img = result.assets[0].base64;
        const uploadResult = await uploadFoto(base64Img);
        
        if (uploadResult.success && uploadResult.url) {
          setFoto(uploadResult.url);
          Alert.alert('Sucesso', 'Foto tirada e enviada com sucesso!');
        } else {
          Alert.alert('Erro', uploadResult.message || 'Falha ao tirar e enviar a foto.');
        }
      } catch (error) {
        console.error("Erro ao tirar e fazer upload da imagem:", error);
        Alert.alert('Erro', 'Não foi possível tirar e fazer upload da foto. Verifique a conexão.');
      } finally {
        setUploading(false);
      }
    } else if (result.canceled) {
        // Usuário cancelou a captura da imagem
        Alert.alert('Cancelado', 'Captura de imagem cancelada.');
    }
  };

  // Função para remover a foto (opcional: apenas limpa o campo, não exclui do Drive)
  const clearPhoto = () => {
    setFoto('');
    Alert.alert('Foto Removida', 'A foto foi removida do formulário.');
  };

  const handleEditar = async () => {
    if (!nome || !turma || !escola || !sala) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (Nome, Turma, Escola, Sala).');
      return;
    }

    try {
      // O 'foto' já contém a URL da imagem (ou está vazio)
      const resultado = await editarAluno({ id: aluno.id, nome, turma, escola, sala, foto });

      if (resultado.success) {
        Alert.alert('Sucesso', resultado.message, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', resultado.message);
      }
    } catch (error) {
      console.error("Erro ao salvar alterações do aluno:", error);
      Alert.alert('Erro', 'Erro ao editar aluno. Verifique a conexão.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Aluno</Text>

      {/* Exibição da Foto Atual */}
      <View style={styles.imageContainer}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagePreview} />
        ) : (
          <Image source={require('../assets/usuario.png')} style={styles.imagePreview} />
        )}
      </View>

      {/* Botões de Seleção/Captura de Imagem */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage} disabled={uploading}>
          <Text style={styles.buttonText}>Escolher Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto} disabled={uploading}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
      </View>

      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Enviando foto...</Text>
        </View>
      )}

      {/* Campo para exibir a URL da foto (opcional, apenas para ver) */}
      <TextInput
        style={styles.input}
        placeholder="URL da Foto (Gerada automaticamente)"
        value={foto}
        onChangeText={setFoto} // Permite edição manual se necessário, mas geralmente é setado pelo upload
        editable={!uploading} // Não permitir edição enquanto a foto está sendo enviada
      />

      {foto ? (
        <TouchableOpacity style={[styles.imageButton, styles.clearButton]} onPress={clearPhoto} disabled={uploading}>
          <Text style={styles.buttonText}>Remover Foto</Text>
        </TouchableOpacity>
      ) : null}

      {/* Campos de Texto Existentes */}
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


