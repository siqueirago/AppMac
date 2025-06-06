import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated, Pressable } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { buscarAlunos } from '../services/Api';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const screenWidth = Dimensions.get('window').width;

export default function RelatorioScreen() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const relatorioRef = useRef();

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const lista = await buscarAlunos();
        setAlunos(lista);
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarAlunos();
  }, []);

  const agruparPor = (chave) => {
    const agrupado = {};
    alunos.forEach((aluno) => {
      const valor = aluno[chave] || 'Não Informado';
      agrupado[valor] = (agrupado[valor] || 0) + 1;
    });

    return {
      labels: Object.keys(agrupado),
      datasets: [{ data: Object.values(agrupado) }],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const renderGrafico = (titulo, dados) => (
    <View style={styles.graficoContainer}>
      <Text style={styles.subtitulo}>{titulo}</Text>
      {dados.labels.length > 0 ? (
        <BarChart
          data={dados}
          width={screenWidth - 30}
          height={220}
          fromZero
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={{ borderRadius: 12 }}
        />
      ) : (
        <Text style={styles.semDados}>Sem dados para este gráfico.</Text>
      )}
    </View>
  );

const exportarPDF = async () => {
  try {
    const porEscola = agruparPor('escola');
    const porTurma = agruparPor('turma');
    const porSala = agruparPor('sala');

    const dataHoraAtual = new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const gerarTabela = (titulo, dados) => {
      const linhas = dados.labels.map((label, idx) => `
        <tr>
          <td style="padding: 6px 10px; border: 1px solid #ccc;">${label}</td>
          <td style="padding: 6px 10px; border: 1px solid #ccc; text-align: right;">${dados.datasets[0].data[idx]}</td>
        </tr>
      `).join('');

      const total = dados.datasets[0].data.reduce((acc, val) => acc + val, 0);

      return `
        <h3 style="color:#333; margin-top: 20px;">${titulo}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="padding: 6px 10px; border: 1px solid #ccc; background: #f5f5f5;">Categoria</th>
              <th style="padding: 6px 10px; border: 1px solid #ccc; background: #f5f5f5;">Total</th>
            </tr>
          </thead>
          <tbody>${linhas}</tbody>
          <tfoot>
            <tr>
              <td style="padding: 6px 10px; border: 1px solid #ccc; font-weight: bold;">Total Geral</td>
              <td style="padding: 6px 10px; border: 1px solid #ccc; text-align: right; font-weight: bold;">${total}</td>
            </tr>
          </tfoot>
        </table>
      `;
    };

    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="text-align:center; color: #6200ee;">Relatório de Alunos</h2>
          <p style="text-align:center; font-size: 14px;">Gerado em: ${dataHoraAtual}</p>

          ${gerarTabela('Distribuição por Escola', porEscola)}
          ${gerarTabela('Distribuição por Turma', porTurma)}
          ${gerarTabela('Distribuição por Sala', porSala)}

          <p style="text-align:center; font-size: 12px; color: #888; margin-top: 40px;">
            Centro de Educação Infantil Maria Amaro Camelo
          </p>
        </body>
      </html>
    `;

    const { uri: pdfUri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri);
    } else {
      Alert.alert('Relatório gerado', 'PDF criado em: ' + pdfUri);
    }

  } catch (err) {
    Alert.alert('Erro ao gerar PDF', err.message);
  }
};
const scale = useRef(new Animated.Value(1)).current;

const onPressIn = () => {
  Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  }).start();
};

const onPressOut = () => {
  Animated.spring(scale, {
    toValue: 1,
    friction: 3,
    useNativeDriver: true,
  }).start();
};

  return (
    
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View ref={relatorioRef} collapsable={false}>
          <Text style={styles.titulo}>Relatórios de Alunos</Text>

          {carregando ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <>
              {renderGrafico('Por Escola', agruparPor('escola'))}
              {renderGrafico('Por Turma', agruparPor('turma'))}
              {renderGrafico('Por Sala', agruparPor('sala'))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Botão flutuante */}
<Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
  <Pressable
    onPress={exportarPDF}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    android_ripple={{ color: 'white', borderless: true }}
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
  >
    <MaterialIcons name="picture-as-pdf" size={28} color="#fff" />
  </Pressable>
</Animated.View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fa4e0',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 15,
    textAlign: 'center'
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
    textAlign: 'center'
  },
  graficoContainer: {
    marginBottom: 30
  },
  semDados: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14
  },
  botaoExportar: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  
fab: {
  position: 'absolute',
  bottom: 60,
  right: 20,
  backgroundColor: '#6200ee',
  width: 60,
  height: 60,
  borderRadius: 30, // metade da largura/altura
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 5, // sombra Android
  shadowColor: '#000', // sombra iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
},
fabText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
}
  
  
});