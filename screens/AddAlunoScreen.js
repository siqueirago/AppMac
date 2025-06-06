import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { adicionarAluno } from '../services/Api';
import styles from '../styles/AlunoFromStyles';
import * as ImagePicker from 'expo-image-picker';

export default function AddAlunoScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [escola, setEscola] = useState('');
  const [sala, setSala] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

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
    quality: 0.3,
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
        setImageUri(null);
        setImageBase64('');
        Alert.alert('Cancelado', 'Nenhuma imagem foi selecionada.');
      }
    } catch (error) {
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
        setImageUri(null);
        setImageBase64('');
        Alert.alert('Cancelado', 'Nenhuma imagem foi capturada.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdicionar = async () => {
    if (!nome.trim() || !turma || !escola || !sala || !imageBase64.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos e selecione uma imagem.');
      return;
    }

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
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o aluno.');
    }
  };

  const renderRadioGroup = (options, selected, onSelect) => (
    <View style={styles.group}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => onSelect(option)}
          disabled={uploadingImage}
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
        placeholder="Nome completo"
        value={nome}
        onChangeText={(text) => setNome((text || '').toUpperCase())}
        editable={!uploadingImage}
      />

      <Text style={styles.inputLabel}>Turma</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={turma}
          onValueChange={setTurma}
          style={styles.picker}
          enabled={!uploadingImage}
        >
          {turmas.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.inputLabel}>Escola</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={escola}
          onValueChange={setEscola}
          style={styles.picker}
          enabled={!uploadingImage}
        >
          {escolas.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.inputLabel}>Sala</Text>
      {renderRadioGroup(salas, sala, setSala)}

      <Text style={styles.inputLabel}>Foto do Aluno</Text>
      <View style={styles.photoSelectionContainer}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.selectedImage} />}
        {!imageUri && !uploadingImage && (
          <Text style={styles.noImageText}>Nenhuma foto selecionada</Text>
        )}
        {uploadingImage && (
          <View style={localStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={localStyles.loadingText}>Processando imagem...</Text>
          </View>
        )}

        <View style={styles.photoButtonsContainer}>
          <TouchableOpacity style={styles.photoButton} onPress={handleChoosePhoto} disabled={uploadingImage}>
            <Text style={styles.photoButtonText}>📁 Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto} disabled={uploadingImage}>
            <Text style={styles.photoButtonText}>📸 Câmera</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Salvar Aluno" onPress={handleAdicionar} disabled={uploadingImage} />
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333'
  }
});