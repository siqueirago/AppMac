import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e5f5',
    padding: 20,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4a148c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    elevation: 2,

  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  turma: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  detailsButton: {
    backgroundColor: '#7e57c2',
    width: 80,
    padding: 5,
    borderRadius: 8,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#4caf50',
    width: 80,
    padding: 5,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    width: 80,
    padding: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },

  headerTitle: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  subHeaderTitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4a148c',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ee',
    textAlign: 'center',
  },

});

    export default styles;
  