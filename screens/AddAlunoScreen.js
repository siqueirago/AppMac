import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView // Adicionado para melhor UX em formulários
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { adicionarAluno } from '../services/Api';
import styles from '../styles/AddAlunoStyles'; // Caminho para o novo arquivo de estilos
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient'; // Importar LinearGradient

export default function AddAlunoScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [escola, setEscola] = useState('');
  const [sala, setSala] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingData, setSavingData] = useState(false); // Novo estado para o processo de salvar dados

  const turmas = [
    { label: 'Selecione a Turma', value: '' },
    { label: 'INFANTIL I', value: 'INFANTIL I' },
    { label: 'INFANTIL II', value: 'INFANTIL II' },
    { label: 'INFANTIL III', value: 'INFANTIL III' },
    { label: 'INFANTIL IV', value: 'INFANTIL IV' },
    { label: 'INFANTIL V', value: 'INFANTIL V' }
  ];
  const salas = ['A', 'B', 'C', 'D', 'E'];
  const escolas = [
    { label: 'Selecione a Escola', value: '' },
    { label: 'CEI Maria Amaro Camelo', value: 'CEI Maria Amaro Camelo' },
    { label: 'EEF Assis Damasceno', value: 'EEF Assis Damasceno' },
    { label: 'EEF Cirilo Barroso Sampaio', value: 'EEF Cirilo Barroso Sampaio' },
    { label: 'CEI Juêncio Câmara', value: 'CEI Juêncio Câmara' }
  ];

  const imagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.3, // Qualidade da imagem reduzida para upload mais rápido
    base64: true
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
          Alert.alert('Permissão Necessária', 'Permita o uso da câmera e galeria para adicionar uma foto.');
        }
      }
    })();
  }, []);

  const handleChoosePhoto = async () => {
    setUploadingImage(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64);
      } else {
        // Nenhuma imagem selecionada, não exibe alerta de cancelamento
        // setImageUri(null);
        // setImageBase64('');
        // Alert.alert('Cancelado', 'Nenhuma imagem foi selecionada.');
      }
    } catch (error) {
      console.error('Erro ao escolher foto da galeria:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTakePhoto = async () => {
    setUploadingImage(true);
    try {
      let result = await ImagePicker.launchCameraAsync(imagePickerOptions);

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64);
      } else {
        // Nenhuma imagem capturada, não exibe alerta de cancelamento
        // setImageUri(null);
        // setImageBase64('');
        // Alert.alert('Cancelado', 'Nenhuma imagem foi capturada.');
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdicionar = async () => {
    if (!nome.trim() || !turma || !escola || !sala || !imageBase64.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos e selecione uma foto do aluno.');
      return;
    }

    setSavingData(true); // Inicia o estado de salvamento

    const alunoData = {
      nome: nome.trim(),
      turma,
      escola,
      sala,
      fotoBase64: 'data:image/jpeg;base64,' + imageBase64,
      action: 'addAluno'
    };

    try {
      const resultado = await adicionarAluno(alunoData);

      if (resultado.success) {
        Alert.alert('Sucesso', resultado.message, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
        // Limpar os campos após o sucesso
        setNome('');
        setTurma('');
        setEscola('');
        setSala('');
        setImageUri(null);
        setImageBase64('');
      } else {
        Alert.alert('Erro', resultado.message || 'Falha ao adicionar aluno.');
      }
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o aluno. Verifique sua conexão.');
    } finally {
      setSavingData(false); // Finaliza o estado de salvamento
    }
  };

  // Renderiza o grupo de rádio buttons para as salas
  const renderRadioGroup = (options, selected, onSelect) => (
    <View style={styles.radioGroupContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.radioOption,
            selected === option && styles.radioOptionSelected,
            (uploadingImage || savingData) && { opacity: 0.6 } // Desabilita visualmente
          ]}
          onPress={() => onSelect(option)}
          disabled={uploadingImage || savingData}
        >
          <View style={[
            styles.radioCircleOuter,
            selected === option && styles.radioCircleOuterSelected
          ]}>
            {selected === option && <View style={styles.radioCircleInner} />}
          </View>
          <Text style={styles.radioLabel}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Ajuste para iOS
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Cadastrar Novo Aluno</Text>

          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Nome do Aluno</Text>
            <TextInput
              style={[styles.input, (uploadingImage || savingData) && { opacity: 0.6 }]}
              placeholder="Nome completo do aluno"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={(text) => setNome((text || '').toUpperCase())}
              editable={!(uploadingImage || savingData)} // Desabilita enquanto carrega/salva
            />

            <Text style={styles.inputLabel}>Turma</Text>
            <View style={[styles.pickerWrapper, (uploadingImage || savingData) && { opacity: 0.6 }]}>
              <Picker
                selectedValue={turma}
                onValueChange={setTurma}
                style={styles.picker}
                enabled={!(uploadingImage || savingData)}
                itemStyle={{ height: 120 }} // Ajuda na visualização em algumas plataformas
              >
                {turmas.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Escola</Text>
            <View style={[styles.pickerWrapper, (uploadingImage || savingData) && { opacity: 0.6 }]}>
              <Picker
                selectedValue={escola}
                onValueChange={setEscola}
                style={styles.picker}
                enabled={!(uploadingImage || savingData)}
                itemStyle={{ height: 120 }}
              >
                {escolas.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Sala</Text>
            {renderRadioGroup(salas, sala, setSala)}

            <Text style={styles.inputLabel}>Foto do Aluno</Text>
            <View style={styles.photoSection}>
              {/* Exibe a imagem selecionada ou um placeholder */}
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.selectedImage} />
              ) : (
                <Image
                  source={require('../assets/usuario.png')} // Caminho para um avatar padrão
                  style={[styles.selectedImage, { borderColor: '#ccc' }]}
                />
              )}
              {/* Texto de nenhuma foto se não houver imagem e não estiver carregando */}
              {!imageUri && !uploadingImage && (
                <Text style={styles.noImageText}>Nenhuma foto selecionada</Text>
              )}

              {/* Botões de seleção de foto */}
              <View style={styles.photoButtonsContainer}>
                <TouchableOpacity
                  style={[styles.photoButton, (uploadingImage || savingData) && { opacity: 0.6 }]}
                  onPress={handleChoosePhoto}
                  disabled={uploadingImage || savingData}
                >
                  <Text style={styles.photoButtonText}>📁 Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.photoButton, (uploadingImage || savingData) && { opacity: 0.6 }]}
                  onPress={handleTakePhoto}
                  disabled={uploadingImage || savingData}
                >
                  <Text style={styles.photoButtonText}>📸 Câmera</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão principal de Salvar */}
            <TouchableOpacity
              style={[styles.mainButton, (uploadingImage || savingData) && { opacity: 0.6 }]}
              onPress={handleAdicionar}
              disabled={uploadingImage || savingData} // Desabilita o botão durante o upload ou salvamento
            >
              {(uploadingImage || savingData) ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.mainButtonText}>Salvar Aluno</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Overlay de carregamento para todo o processo */}
      {(uploadingImage || savingData) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>
            {uploadingImage ? 'Processando imagem...' : 'Salvando aluno...'}
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}