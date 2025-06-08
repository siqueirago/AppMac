import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView, 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/EditAlunosStyles';
import { editarAluno } from '../services/Api';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditAlunoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { aluno } = route.params;

  const [nome, setNome] = useState(aluno.nome);
  const [turma, setTurma] = useState(aluno.turma);
  const [escola, setEscola] = useState(aluno.escola);
  const [sala, setSala] = useState(aluno.sala);
  const [foto, setFoto] = useState(aluno.foto);
  const [novaFotoBase64, setNovaFotoBase64] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaLibraryStatus !== 'granted') {
          Alert.alert('Permissão necessária', 'Desculpe, precisamos de permissão para acessar sua galeria!');
        }
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert('Permissão necessária', 'Desculpe, precisamos de permissão para acessar sua câmera!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    console.log('Resultado do ImagePicker (Galeria):', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];

      if (selectedAsset.base64) {
        const fileType = selectedAsset.type || 'image';
        const fileExtension = selectedAsset.uri ? selectedAsset.uri.split('.').pop() : 'jpeg';
        const formattedBase64 = `data:${fileType}/${fileExtension};base64,${selectedAsset.base64}`;

        setNovaFotoBase64(formattedBase64);
        setFoto(selectedAsset.uri);
        Alert.alert('Foto selecionada', 'A nova foto será salva ao clicar em "Salvar Alterações".');
      } else {
        console.error('Base64 não encontrado no asset da galeria.');
        Alert.alert('Erro', 'Não foi possível processar a foto selecionada.');
      }
    } else if (result.canceled) {
      Alert.alert('Cancelado', 'Seleção de imagem cancelada.');
    } else {
      Alert.alert('Erro', 'Não foi possível selecionar a foto. Tente novamente.');
      console.error('Falha ao selecionar imagem da galeria:', result);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    console.log('Resultado do ImagePicker (Câmera):', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];

      if (selectedAsset.base64) {
        const fileType = selectedAsset.type || 'image';
        const fileExtension = selectedAsset.uri ? selectedAsset.uri.split('.').pop() : 'jpeg';
        const formattedBase64 = `data:${fileType}/${fileExtension};base64,${selectedAsset.base64}`;

        setNovaFotoBase64(formattedBase64);
        setFoto(selectedAsset.uri);
        Alert.alert('Foto capturada', 'A nova foto será salva ao clicar em "Salvar Alterações".');
      } else {
        console.error('Base64 não encontrado no asset da câmera.');
        Alert.alert('Erro', 'Não foi possível processar a foto capturada.');
      }
    } else if (result.canceled) {
      Alert.alert('Cancelado', 'Captura de imagem cancelada.');
    } else {
      Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
      console.error('Falha ao tirar foto:', result);
    }
  };

  const clearPhoto = () => {
    setFoto('');
    setNovaFotoBase64(null);
    Alert.alert('Foto Removida', 'A foto foi removida do formulário. Salve as alterações para remover da planilha.');
  };

  const handleEditar = async () => {
    if (!nome || !turma || !escola || !sala) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (Nome, Turma, Escola, Sala).');
      return;
    }

    setUploading(true);
    try {
      const alunoParaEditar = {
        id: aluno.id,
        nome,
        turma,
        escola,
        sala,
        fotoBase64: novaFotoBase64,
        foto: novaFotoBase64 ? null : foto
      };

      console.log('Dados enviados para editarAluno (Api.js):', alunoParaEditar);

      const resultado = await editarAluno(alunoParaEditar);

      if (resultado.success) {
        Alert.alert('Sucesso', resultado.message, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', resultado.message || 'Ocorreu um erro ao editar o aluno.');
      }
    } catch (error) {
      console.error("Erro ao salvar alterações do aluno:", error);
      Alert.alert('Erro', 'Erro ao editar aluno. Verifique a conexão ou tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient colors={['#FDE910', '#2196F3']} style={styles.gradientBackground}>
      {/* Adicione o KeyboardAvoidingView aqui */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' para iOS, 'height' para Android
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -50} // Ajuste o offset conforme a necessidade
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Editar Aluno</Text>

          <View style={styles.card}>
            <View style={styles.imageSection}>
              <View style={styles.imagePreviewContainer}>
                {foto ? (
                  <Image source={{ uri: foto }} style={styles.imagePreview} />
                ) : (
                  <Image source={require('../assets/usuario.png')} style={styles.defaultImage} />
                )}
              </View>

              <View style={styles.imageButtonContainer}>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage} disabled={uploading}>
                  <MaterialIcons name="folder" size={24} color="#fff" style={styles.iconStyle} />
                  <Text style={styles.buttonText}>Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto} disabled={uploading}>
                  <MaterialIcons name="camera-alt" size={24} color="#fff" style={styles.iconStyle} />
                  <Text style={styles.buttonText}>Câmera</Text>
                </TouchableOpacity>
              </View>

              {foto ? (
                <TouchableOpacity style={[styles.imageButton, styles.clearButton]} onPress={clearPhoto} disabled={uploading}>
                  <MaterialIcons name="delete-forever" size={20} color="#fff" style={styles.iconStyle} />
                  <Text style={styles.buttonText}>Remover Foto</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.input}>
              <MaterialIcons name="person" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                editable={!uploading}
              />
            </View>
            <View style={styles.input}>
              <MaterialIcons name="class" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="Turma"
                value={turma}
                onChangeText={setTurma}
                editable={!uploading}
              />
            </View>
            <View style={styles.input}>
              <MaterialIcons name="school" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="Escola"
                value={escola}
                onChangeText={setEscola}
                editable={!uploading}
              />
            </View>
            <View style={styles.input}>
              <MaterialIcons name="meeting-room" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="Sala"
                value={sala}
                onChangeText={setSala}
                editable={!uploading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleEditar}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>

          {uploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Salvando alterações...</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}