
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  gradientBackground: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#3498db', // Azul vibrante, similar ao da tela de login
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15, // Espaçamento entre os botões
    shadowColor: '#000',
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
  logoutButton: {
    marginTop: 40, // Mais espaço do último botão
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fundo semitransparente para o botão de logout
    borderRadius: 30, // Botão de logout circular ou bem arredondado
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
export default styles;
