import React, { useState } from 'react';
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
  Platform // Para verificar a plataforma (iOS/Android)
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { adicionarAluno } from '../services/Api';
import styles from '../styles/AlunoFromStyles';

// Importar o ImagePicker do Expo
import * as ImagePicker from 'expo-image-picker'; // Atenção: importação diferente!

export default function AddAlunoScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [escola, setEscola] = useState('');
  const [sala, setSala] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [fotoUrlManual, setFotoUrlManual] = useState('');

  const turmas = [
    { label: 'Selecione a Turma', value: '' },
    { label: 'INFANTIL I', value: 'INFANTIL I' },
    { label: 'INFANTIL II', value: 'INFANTIL II' },
    { label: 'INFANTIL III', value: 'INFANTIL III' },
    { label: 'INFANTIL IV', value: 'INFANTIL IV' },
    { label: 'INFANTIL V', value: 'INFANTIL V' }
  ];
  const salas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // NOTA: As opções são ligeiramente diferentes para o Expo ImagePicker
  const imagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
    allowsEditing: true, // Permite que o usuário edite/corte a imagem
    aspect: [1, 1], // Proporção 1:1 (quadrado)
    quality: 0.7, // Qualidade da imagem (0 a 1)
  };

  const handleChoosePhoto = async () => {
    // Solicitar permissão de acesso à galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar sua galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

    console.log('Expo ImagePicker Result: ', result);

    if (!result.canceled) { // Verifica se não foi cancelado
      setFotoUri(result.assets[0].uri);
      setFotoUrlManual(''); // Limpa o campo de URL manual
    }
  };

  const handleTakePhoto = async () => {
    // Solicitar permissão de acesso à câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar sua câmera.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync(imagePickerOptions);

    console.log('Expo Camera Result: ', result);

    if (!result.canceled) { // Verifica se não foi cancelado
      setFotoUri(result.assets[0].uri);
      setFotoUrlManual(''); // Limpa o campo de URL manual
    }
  };

  const handleAdicionar = async () => {
    const fotoParaSalvar = fotoUri || fotoUrlManual.trim();

    if (!nome.trim() || !turma || !escola.trim() || !sala || !fotoParaSalvar) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione/insira uma foto.');
      return;
    }

    try {
      const resultado = await adicionarAluno({ nome, turma, escola, sala, foto: fotoParaSalvar });

      if (resultado.success) {
        Alert.alert('Sucesso', resultado.message, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
        setNome('');
        setTurma('');
        setEscola('');
        setSala('');
        setFotoUri(null);
        setFotoUrlManual('');
      } else {
        Alert.alert('Erro', resultado.message);
      }
    } catch (error) {
      console.error("Erro ao adicionar aluno:", error);
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
      />

      <Text style={styles.inputLabel}>Turma</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={turma}
          onValueChange={(itemValue) => setTurma(itemValue)}
          style={styles.picker}
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
      />

      <Text style={styles.sectionTitle}>Sala</Text>
      {renderRadioGroup(salas, sala, setSala)}

      {/* Seção de Seleção de Foto */}
      <Text style={styles.inputLabel}>Foto do Aluno</Text>
      <View style={styles.photoSelectionContainer}>
        {fotoUri && (
          <Image source={{ uri: fotoUri }} style={styles.selectedImage} />
        )}
        <View style={styles.photoButtonsContainer}>
          <TouchableOpacity style={styles.photoButton} onPress={handleChoosePhoto}>
            <Text style={styles.photoButtonText}>Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
            <Text style={styles.photoButtonText}>Câmera</Text>
          </TouchableOpacity>
        </View>

      </View>

      <Button title="Salvar Aluno" onPress={handleAdicionar} />
    </ScrollView>
  );
}