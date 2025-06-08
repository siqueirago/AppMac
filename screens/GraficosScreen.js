import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, Dimensions, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated, Pressable } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { buscarAlunos } from '../services/Api';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import styles from '../styles/GraficosScreenStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function GraficosScreen() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const relatorioRef = useRef();

  useFocusEffect(
    useCallback(() => {
      const carregarDadosGraficos = async () => {
        setCarregando(true);
        try {
          const lista = await buscarAlunos();
          if (Array.isArray(lista)) {
            setAlunos(lista);
          } else {
            console.warn('Dados recebidos da API não são um array:', lista);
            setAlunos([]);
          }
        } catch (error) {
          console.error('Erro ao carregar alunos para gráficos:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados para os gráficos.');
          setAlunos([]);
        } finally {
          setCarregando(false);
        }
      };

      carregarDadosGraficos();

      return () => {};
    }, [])
  );

  const agruparPor = (chave) => {
    const agrupado = {};
    alunos.forEach((aluno) => {
      const valor = aluno[chave] || 'Não Informado';
      agrupado[valor] = (agrupado[valor] || 0) + 1;
    });

    const labelsOrdenadas = Object.keys(agrupado).sort((a, b) => a.localeCompare(b));
    const dadosOrdenados = labelsOrdenadas.map(label => agrupado[label]);

    return {
      labels: labelsOrdenadas,
      datasets: [{ data: dadosOrdenados }],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.8,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: 10,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e0e0e0',
    },
  };

  const renderGrafico = (titulo, dados) => (
    <View style={styles.graficoContainer}>
      <Text style={styles.subtitulo}>{titulo}</Text>
      {dados.labels.length > 0 ? (
        <BarChart
          data={dados}
          width={screenWidth - 60}
          height={220}
          fromZero
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={styles.chartStyle}
        />
      ) : (
        <Text style={styles.semDados}>Sem dados para este gráfico.</Text>
      )}
    </View>
  );

  const exportarPDF = async () => {
    if (!alunos || alunos.length === 0) {
      Alert.alert('Dados Indisponíveis', 'Não há dados de alunos para gerar o relatório.');
      return;
    }
    Alert.alert('Gerando PDF...', 'Aguarde enquanto o relatório é processado.');
    try {
      const porEscola = agruparPor('escola');
      const porTurma = agruparPor('turma');
      const porSala = agruparPor('sala');

      const dataHoraAtual = new Date().toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      const gerarTabelaHTML = (titulo, dadosGrafico, tipo) => {
        const linhas = dadosGrafico.labels.map((label, idx) => {
          const valor = dadosGrafico.datasets[0].data[idx];
          let categoriaDisplay = label;

          if (tipo === 'sala') {
            const alunoNaSala = alunos.find(aluno => aluno.sala === label);
            const escolaDaSala = alunoNaSala ? alunoNaSala.escola : 'Não Informada';
            categoriaDisplay = `Sala ${label} (${escolaDaSala})`;
          }

          return `
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #ccc;">${categoriaDisplay}</td>
              <td style="padding: 6px 8px; border: 1px solid #ccc; text-align: right;">${valor}</td>
            </tr>
          `;
        }).join('');

        const total = dadosGrafico.datasets[0].data.reduce((acc, val) => acc + val, 0);

        return `
          <h3 style="color:#2196F3; margin-top: 14px;">${titulo}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
            <thead>
              <tr>
                <th style="padding: 4px 8px; border: 1px solid #ccc; background: #f0f8ff;">Categoria</th>
                <th style="padding: 4px 8px; border: 1px solid #ccc; background: #f0f8ff;">Total</th>
              </tr>
            </thead>
            <tbody>${linhas}</tbody>
            <tfoot>
              <tr>
                <td style="padding: 4px 8px; border: 1px solid #ccc; font-weight: bold;">Total Geral</td>
                <td style="padding: 4px 8px; border: 1px solid #ccc; text-align: right; font-weight: bold;">${total}</td>
              </tr>
            </tfoot>
          </table>
        `;
      };

      const htmlContent = `
        <html>
          <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 12px; color: #333;">
            <h2 style="text-align:center; color: #4CAF50; font-size: 20px; margin-bottom: 10px;">Regional Salitre</h2>
            <h3 style="text-align:center; color: #2196F3; font-size: 16px; margin-bottom: 12px;">Relatório de Alunos - Educação Infantil</h3>
            <p style="text-align:center; font-size: 12px; color: #666;">Gerado em: ${dataHoraAtual}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 12px 0;">

            ${gerarTabelaHTML('Distribuição por Escola', porEscola, 'escola')}
            ${gerarTabelaHTML('Distribuição por Turma', porTurma, 'turma')}
            ${gerarTabelaHTML('Distribuição por Sala', porSala, 'sala')}
            
          </body>
        </html>
      `;

      const { uri: pdfUri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
      } else {
        Alert.alert('Funcionalidade Indisponível', 'Compartilhamento de arquivos não disponível neste dispositivo.');
      }

    } catch (err) {
      console.error('Erro ao gerar/compartilhar PDF:', err);
      Alert.alert('Erro ao Gerar PDF', 'Ocorreu um erro ao gerar ou compartilhar o relatório. Tente novamente.');
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
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View ref={relatorioRef} collapsable={false}>
            <Text style={styles.titulo}>Gráficos de Alunos</Text>

            {carregando ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Carregando gráficos...</Text>
              </View>
            ) : (
              <>
                {renderGrafico('Alunos por Escola', agruparPor('escola'))}
                {renderGrafico('Alunos por Turma', agruparPor('turma'))}
                {renderGrafico('Alunos por Sala', agruparPor('sala'))}
                {alunos.length === 0 && (
                  <Text style={[styles.semDados, { color: '#ffffff' }]}>
                    Nenhum aluno encontrado para gerar gráficos.
                  </Text>
                )}
              </>
            )}
          </View>
        </ScrollView>

        {!carregando && alunos.length > 0 && (
          <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
            <Pressable
              onPress={exportarPDF}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialIcons name="picture-as-pdf" size={28} color="#fff" />
            </Pressable>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

