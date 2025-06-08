// styles/ModernLoginStyles.js
import { StyleSheet } from 'react-native';

const ModernLoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30, // Espaçamento horizontal
  },
  logoContainer: {
    marginBottom: 40, // Mais espaço abaixo do logo
    alignItems: 'center',
  },
  logo: {
    width: 150, // Tamanho do logo
    height: 150,
    borderRadius: 75, // Borda arredondada para o logo
    borderWidth: 3,
    borderColor: '#ffffff', // Borda branca
    shadowColor: '#000', // Sombra para o logo
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15, // Espaçamento acima do texto do logo
    textShadowColor: 'rgba(0, 0, 0, 0.4)', // Sombra para o texto
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30, // Mais espaço abaixo do título
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo mais translúcido
    borderRadius: 25, // Bordas bem arredondadas
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333', // Cor do texto mais escura
    marginBottom: 20, // Espaçamento entre os inputs
    shadowColor: '#000', // Sombra para os inputs
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#3498db', // Cor de botão mais vibrante (azul)
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20, // Espaçamento acima do botão
    shadowColor: '#000', // Sombra para o botão
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default ModernLoginStyles;