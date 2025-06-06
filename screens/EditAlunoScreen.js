import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform // Adicione Platform aqui se não estiver
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/EditAlunosStyles';
import { editarAluno } from '../services/Api'; // REMOVA 'uploadFoto' daqui
import * as ImagePicker from 'expo-image-picker';

export default function EditAlunoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { aluno } = route.params;

  const [nome, setNome] = useState(aluno.nome);
  const [turma, setTurma] = useState(aluno.turma);
  const [escola, setEscola] = useState(aluno.escola);
  const [sala, setSala] = useState(aluno.sala);
  const [foto, setFoto] = useState(aluno.foto); // Estado para a URL da foto ATUAL (ou o URI temporário da nova foto para preview)
  const [novaFotoBase64, setNovaFotoBase64] = useState(null); // NOVO ESTADO para o Base64 da foto recém-selecionada/tirada
  const [uploading, setUploading] = useState(false); // Estado para controlar o carregamento/envio da imagem

  // Solicitar permissões de mídia ao carregar a tela
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

  // Função para escolher imagem da galeria
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduzir a qualidade para upload mais rápido
      base64: true, // Importante para obter como Base64
    });

    console.log('Resultado do ImagePicker (Galeria):', result); // Log para depuração

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      
      if (selectedAsset.base64) {
        // Formata o Base64 para incluir o prefixo completo (data:image/jpeg;base64,...)
        // Isso é importante para o Apps Script.
        const fileType = selectedAsset.type || 'image'; // 'image' ou 'video'
        // Tenta inferir a extensão do arquivo da URI ou assume 'jpeg'
        const fileExtension = selectedAsset.uri ? selectedAsset.uri.split('.').pop() : 'jpeg'; 
        const formattedBase64 = `data:${fileType}/${fileExtension};base64,${selectedAsset.base64}`;

        setNovaFotoBase64(formattedBase64); // Armazena o Base64 para envio posterior
        setFoto(selectedAsset.uri); // Define o URI local para exibição no preview
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

  // Função para tirar foto com a câmera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true, // Importante para obter como Base64
    });

    console.log('Resultado do ImagePicker (Câmera):', result); // Log para depuração

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      
      if (selectedAsset.base64) {
        const fileType = selectedAsset.type || 'image';
        const fileExtension = selectedAsset.uri ? selectedAsset.uri.split('.').pop() : 'jpeg';
        const formattedBase64 = `data:${fileType}/${fileExtension};base64,${selectedAsset.base64}`;

        setNovaFotoBase64(formattedBase64); // Armazena o Base64 para envio posterior
        setFoto(selectedAsset.uri); // Define o URI local para exibição no preview
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

  // Função para remover a foto (apenas limpa o preview e o Base64 a ser enviado)
  const clearPhoto = () => {
    setFoto(''); // Limpa o preview
    setNovaFotoBase64(null); // Garante que nenhuma nova foto será enviada
    Alert.alert('Foto Removida', 'A foto foi removida do formulário. Salve as alterações para remover da planilha.');
  };

  const handleEditar = async () => {
    if (!nome || !turma || !escola || !sala) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (Nome, Turma, Escola, Sala).');
      return;
    }

    setUploading(true); // Ativa o indicador de upload ao iniciar a chamada à API
    try {
      const alunoParaEditar = {
        id: aluno.id,
        nome,
        turma,
        escola,
        sala,
        // Se novaFotoBase64 existe, ela será enviada para o Apps Script
        // Se não, o Apps Script vai usar o 'foto' existente (a URL que veio do aluno original)
        fotoBase64: novaFotoBase64, // Envia o Base64 da nova foto, se houver
        foto: novaFotoBase64 ? null : foto // Se tem nova foto Base64, foto é null. Caso contrário, envia a URL existente.
      };

      console.log('Dados enviados para editarAluno (Api.js):', alunoParaEditar); // Log para depuração
      
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
      setUploading(false); // Desativa o indicador de upload ao final da operação
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Aluno</Text>

      
      <View style={styles.imageContainer}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagePreview} />
        ) : (
          <Image source={require('../assets/usuario.png')} style={styles.imagePreview} />
        )}
      </View>

      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage} disabled={uploading}>
          <Text style={styles.buttonText}>📂 Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto} disabled={uploading}>
          <Text style={styles.buttonText}>📸 Câmera</Text>
        </TouchableOpacity>
      </View>

      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Enviando dados...</Text> 
        </View>
      )}

      
      <TextInput
        style={styles.input}
        placeholder="URL da Foto (Gerada automaticamente)"
        value={foto} // Exibe a URL atual ou a URI local da nova foto
        onChangeText={setFoto}
        editable={false} // Não permitir edição manual, pois é gerada
      />

      {foto ? (
        <TouchableOpacity style={[styles.imageButton, styles.clearButton]} onPress={clearPhoto} disabled={uploading}>
          <Text style={styles.buttonText}>Remover Foto</Text>
        </TouchableOpacity>
      ) : null}

      
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

