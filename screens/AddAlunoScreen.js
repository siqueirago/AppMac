import React, { useState, useEffect } from 'react'; // Adicione useEffect
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image, // Importar Image para exibir a foto selecionada
  Platform, // Para verificar a plataforma (iOS/Android)
  ActivityIndicator // Para o indicador de carregamento
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { adicionarAluno } from '../services/Api'; // Sua função de adicionarAluno
import styles from '../styles/AlunoFromStyles'; // Seus estilos globais (Manter o seu)

// Importar o ImagePicker do Expo
import * as ImagePicker from 'expo-image-picker';

export default function AddAlunoScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [escola, setEscola] = useState('');
  const [sala, setSala] = useState('');
  const [imageUri, setImageUri] = useState(null); // Estado para a URI local da imagem selecionada
  const [imageBase64, setImageBase64] = useState(''); // Estado para a string Base64 da imagem
  const [uploadingImage, setUploadingImage] = useState(false); // Estado para o indicador de carregamento da imagem

  const turmas = [
    { label: 'Selecione a Turma', value: '' },
    { label: 'INFANTIL I', value: 'INFANTIL I' },
    { label: 'INFANTIL II', value: 'INFANTIL II' },
    { label: 'INFANTIL III', value: 'INFANTIL III' },
    { label: 'INFANTIL IV', value: 'INFANTIL IV' },
    { label: 'INFANTIL V', value: 'INFANTIL V' }
  ];
  const salas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Opções para o ImagePicker, agora com base64: true
  const imagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // Proporção 1:1 (quadrado)
    quality: 0.7, // Qualidade da imagem (0 a 1)
    base64: true, // ESSENCIAL: Solicita a imagem em formato base64
  };

  // Solicitar permissões ao montar o componente
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
          Alert.alert('Permissão Necessária', 'Precisamos de permissão para acessar sua galeria e câmera para esta funcionalidade.');
        }
      }
    })();
  }, []);

  const handleChoosePhoto = async () => {
    setUploadingImage(true); // Inicia o carregamento
    try {
      let result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64); // Salva o Base64
        console.log('Foto da Galeria selecionada. URI:', result.assets[0].uri);
      } else {
        setImageUri(null);
        setImageBase64('');
        Alert.alert('Seleção Cancelada', 'Nenhuma foto foi selecionada da galeria.');
      }
    } catch (error) {
      console.error('Erro ao escolher foto da galeria:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a foto da galeria.');
    } finally {
      setUploadingImage(false); // Finaliza o carregamento
    }
  };

  const handleTakePhoto = async () => {
    setUploadingImage(true); // Inicia o carregamento
    try {
      let result = await ImagePicker.launchCameraAsync(imagePickerOptions);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64); // Salva o Base64
        console.log('Foto tirada. URI:', result.assets[0].uri);
      } else {
        setImageUri(null);
        setImageBase64('');
        Alert.alert('Captura Cancelada', 'Nenhuma foto foi tirada.');
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    } finally {
      setUploadingImage(false); // Finaliza o carregamento
    }
  };

const handleAdicionar = async () => {
  console.log("handleAdicionar: Início da função."); // NOVO LOG
  console.log("Dados do formulário antes da validação:", { nome, turma, escola, sala, imageBase64: imageBase64 ? 'Existe Base64' : 'Não existe Base64' }); // NOVO LOG

  if (!nome.trim() || !turma || !escola.trim() || !sala || !imageBase64.trim()) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione uma foto.');
    console.log("handleAdicionar: Validação falhou."); // NOVO LOG
    return;
  }

  try {
    const alunoData = {
      nome: nome.trim(),
      turma: turma.trim(),
      escola: escola.trim(),
      sala: sala.trim(),
      fotoBase64: imageBase64,
      action: 'addAluno', // Certifique-se que a action está aqui!
    };

    console.log("handleAdicionar: Dados do aluno prontos para envio:", alunoData); // NOVO LOG
    console.log("handleAdicionar: Chamando adicionarAluno da API..."); // NOVO LOG

    const resultado = await adicionarAluno(alunoData);

    console.log("handleAdicionar: Resultado da API:", resultado); // NOVO LOG

    if (resultado.success) {
      Alert.alert('Sucesso', resultado.message, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
      setNome('');
      setTurma('');
      setEscola('');
      setSala('');
      setImageUri(null);
      setImageBase64('');
      
    } else {
      Alert.alert('Erro', resultado.message || 'Ocorreu um erro ao adicionar o aluno.');
      console.log("handleAdicionar: API retornou erro:", resultado.message); // NOVO LOG
    }
  } catch (error) {
    console.error("handleAdicionar: Erro catastrófico ao adicionar aluno:", error); // NOVO LOG
    Alert.alert('Erro', 'Ocorreu um erro ao adicionar o aluno. Tente novamente.');
  }
};

  const renderRadioGroup = (options, selected, onSelect) => (
    <View style={styles.group}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => onSelect(option)}
          disabled={uploadingImage} // Desabilita enquanto imagem carrega
        >
          <View style={styles.circleOuter}>
            {selected === option && <View style={styles.circleInner} />}
          </View>
          <Text style={styles.label}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Aluno</Text>

      <Text style={styles.inputLabel}>Nome do Aluno</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome completo do aluno"
        value={nome}
        onChangeText={(text) => setNome((text || '').toLocaleUpperCase())}
        editable={!uploadingImage} // Desabilita enquanto imagem carrega
      />

      <Text style={styles.inputLabel}>Turma</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={turma}
          onValueChange={(itemValue) => setTurma(itemValue)}
          style={styles.picker}
          enabled={!uploadingImage} // Desabilita enquanto imagem carrega
        >
          {turmas.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.inputLabel}>Escola</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Escola"
        value={escola}
        onChangeText={(text) => setEscola((text || '').toLocaleUpperCase())}
        editable={!uploadingImage} // Desabilita enquanto imagem carrega
      />

      <Text style={styles.sectionTitle}>Sala</Text>
      {renderRadioGroup(salas, sala, setSala)}

      {/* Seção de Seleção de Foto */}
      <Text style={styles.inputLabel}>Foto do Aluno</Text>
      <View style={styles.photoSelectionContainer}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.selectedImage} />
        )}
        {!imageUri && !uploadingImage && <Text style={styles.noImageText}>Nenhuma foto selecionada</Text>}
        {uploadingImage && (
          <View style={localStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={localStyles.loadingText}>Processando imagem...</Text>
          </View>
        )}

        <View style={styles.photoButtonsContainer}>
          <TouchableOpacity style={styles.photoButton} onPress={handleChoosePhoto} disabled={uploadingImage}>
            <Text style={styles.photoButtonText}>Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto} disabled={uploadingImage}>
            <Text style={styles.photoButtonText}>Câmera</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Salvar Aluno" onPress={handleAdicionar} disabled={uploadingImage} />
    </ScrollView>
  );
}

// Estilos locais para o ActivityIndicator
const localStyles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});