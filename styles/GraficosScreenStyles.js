

// styles/GraficosScreenStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const GraficosScreenStyles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // Título em branco para contrastar com o gradiente
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  graficoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fundo quase opaco para os cartões de gráfico
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center', // Centraliza o gráfico dentro do card
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  semDados: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 20,
  },
  chartStyle: {
    borderRadius: 12, // Borda arredondada para o gráfico
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF6F00', // Um laranja vibrante para o FAB
    borderRadius: 30, // Torna-o circular
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
});

export default GraficosScreenStyles;