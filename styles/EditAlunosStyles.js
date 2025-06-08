import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // Título em branco para contrastar com o gradiente
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fundo quase opaco para os cartões
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreviewContainer: {
    width: 150,
    height: 150,
    borderRadius: 75, // Para imagem circular
    backgroundColor: '#e0e0e0', // Cor de fundo do placeholder
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FDE910', // Borda para a imagem
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  defaultImage: {
    width: 80,
    height: 80,
    tintColor: '#666', // Cor para o ícone de usuário padrão
  },
  imageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#2196F3', // Azul para os botões de foto
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  clearButton: {
    backgroundColor: '#FF6F00', // Laranja para o botão de remover
    marginTop: 10,
    width: 'auto', // Ajusta a largura para o conteúdo
    alignSelf: 'center', // Centraliza o botão
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Espaço entre ícone e texto
  },
  iconStyle: {
    marginRight: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row', // Para alinhar ícone e input
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 10,
    color: '#666',
  },
  textInputStyle: {
    flex: 1, // Faz com que o TextInput ocupe o espaço restante
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Verde para o botão salvar
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30, // Espaço extra na parte inferior
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15, // Adapta ao card
    zIndex: 10, // Garante que fique por cima
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
    fontSize: 16,
  },
});

export default styles;
