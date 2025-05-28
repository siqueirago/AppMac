import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3e5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#4a148c',
    marginTop: 20,


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#4a148c',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 20,
    color: '#fff',
  },
  escolaText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a148c',
  },
  listItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  
  },
  emptyMessage: {
    fontSize: 16,
    color: '#777',
  },
  schoolSection: {
    marginBottom: 10,
    paddingLeft: 10,
    borderColor: '#eee',
    borderLeftWidth: 2,
  },
  schoolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#925182',
    marginBottom: 5,
  },
  schoolSubItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },

});
export default styles;