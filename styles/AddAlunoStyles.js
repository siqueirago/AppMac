import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 30, // Espaçamento vertical
    paddingHorizontal: 20, // Espaçamento horizontal
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fundo quase opaco para o card
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15, // Espaçamento acima do rótulo
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0', // Fundo levemente cinza para inputs
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerWrapper: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    overflow: 'hidden', // Garante que o Picker respeite o borderRadius
  },
  picker: {
    width: '100%',
    color: '#333',
  },
  radioGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Distribui os botões uniformemente
    marginBottom: 10,
    marginTop: 10,
    width: '100%',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    minWidth: 80, // Largura mínima para os botões
    justifyContent: 'center',
    marginHorizontal: 5, // Espaçamento entre as opções
  },
  radioOptionSelected: {
    borderColor: '#3498db', // Borda azul para o selecionado
    backgroundColor: '#eaf5ff', // Fundo azul claro para o selecionado
  },
  radioCircleOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleOuterSelected: {
    borderColor: '#3498db',
  },
  radioCircleInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Imagem circular
    borderWidth: 3,
    borderColor: '#3498db', // Borda azul
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  photoButton: {
    backgroundColor: '#2ecc71', // Verde para botões de foto
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    flex: 1, // Faz com que os botões se expandam igualmente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  photoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainButton: {
    backgroundColor: '#4CAF50', // Verde para o botão principal
    borderRadius: 15,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30, // Mais espaço abaixo do botão
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Cobre a tela inteira
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Garante que fique por cima de tudo
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#ffffff',
  },
});
export default styles;