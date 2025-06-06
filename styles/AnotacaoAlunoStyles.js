import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Importante para ScrollView
    padding: 20,
    backgroundColor: '#bbdeff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  textArea: {
    minHeight: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top', // Para Android, garantir que o texto comece no topo
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  // NOVOS ESTILOS PARA AS COMPETÊNCIAS
  competenciasContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  competenciaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#555',
    textAlign: 'center',
  },
  competenciaLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
    color: '#333',
  },
  pickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden', // Importante para que a borda do picker apareça corretamente no iOS
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
    // No iOS, a cor do texto do picker é definida globalmente ou pelo item.
    // No Android, a cor do texto pode ser controlada aqui: color: '#333',
  },
});
export default styles;
