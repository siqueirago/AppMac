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

  cardSala: {
  backgroundColor: '#f9f9f9',
  padding: 12,
  marginVertical: 8,
  borderRadius: 8,
  borderColor: '#ccc',
  borderWidth: 1,
},

cardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

salaTexto: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#4a148c',
},

escolaTexto: {
  fontSize: 14,
  color: '#777',
  marginTop: 4,
},

quantidadeTexto: {
  marginTop: 6,
  fontSize: 15,
  fontWeight: '500',
  color: '#444',
},

iconeDetalhe: {
  fontSize: 18,
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
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
    color: '#333',
    marginBottom: 5,
  
  },
  emptyMessage: {
    fontSize: 16,
    color: '#777',
  },
  schoolContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 5,
  },
  schoolItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
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