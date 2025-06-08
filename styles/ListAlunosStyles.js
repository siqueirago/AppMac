import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20, // Espaço no topo para o cabeçalho
    backgroundColor: 'transparent', // Fundo transparente para o gradiente aparecer
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 5,
  },
  subHeaderTitle: {
    fontSize: 18,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fundo quase opaco para o card
    borderRadius: 15, // Bordas arredondadas para o card
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000', // Sombra para o card
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35, // Imagem circular
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#3498db', // Borda azul para a imagem
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  turma: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap', // Permite que os botões quebrem a linha se não houver espaço
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 5, // Espaçamento entre os botões
    marginTop: 5, // Espaçamento caso quebre a linha
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailsButton: {
    backgroundColor: '#3498db', // Azul
  },
  editButton: {
    backgroundColor: '#f39c12', // Laranja
  },
  deleteButton: {
    backgroundColor: '#e74c3c', // Vermelho
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5', // Um fundo claro para o loading
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noStudentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noStudentsText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

    export default styles;
  