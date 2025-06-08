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
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  section: {
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    flexDirection: 'row', // Para alinhar ícone e texto
    alignItems: 'center',
  },
  sectionTitleText: {
    marginLeft: 10, // Espaço entre o ícone e o texto
    color: '#333',
    fontWeight: 'bold',
    fontSize: 22,
  },
  // Estilo específico para o card de Sala
  cardSala: {
    backgroundColor: '#eaf5ff', // Fundo azul claro para destaque
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3', // Borda lateral azul
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  salaTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3', // Cor do texto da sala
  },
  escolaTexto: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
  },
  quantidadeTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'right', // Alinha a quantidade à direita
    marginTop: 5,
  },
  // Estilos para os outros itens de lista (turmas, escolas)
  sectionItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ccc',
  },
  listItem: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24, // Espaçamento entre linhas
  },
  schoolContainer: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // O gradiente será o fundo
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#ffffff',
  },
});
export default styles;