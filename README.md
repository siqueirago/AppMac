# Sistema de Gerenciamento Escolar - Educação infantil
Este projeto consiste em um aplicativo mobile desenvolvido para otimizar e simplificar a gestão de alunos e o acompanhamento 
pedagógico no **Centro de Educação Infantil (CEI) Maria Amaro Camelo**. Ele visa modernizar as operações diárias, fornecendo uma 
ferramenta intuitiva para professores e diretores gerenciarem informações de estudantes, registrarem observações de desenvolvimento
e acessarem dados cruciais de forma eficiente.
A solução integra um frontend mobile com um backend flexível baseado em serviços do Google, aproveitando a familiaridade e a acessibilidade
de ferramentas como Google Sheets e Google Drive.

## Principais Funcionalidades
O aplicativo oferece as seguintes funcionalidades para a equipe do CEI:


 * **Autenticação Segura:** Sistema de login com diferentes perfis de acesso (Diretor e Professor).

![Login adm](https://github.com/user-attachments/assets/601c7221-673e-4d48-b77e-cc5399d8de57)


* **Gestão Abrangente de Alunos:**
  
    * Cadastro, listagem, edição e visualização detalhada de informações dos alunos.
    * Associação de fotos dos alunos (armazenadas no Google Drive).
    * Organização de alunos por turma e sala.
    * Registro de anotações e observações sobre o desenvolvimento individual de cada criança (linguagens, cognição, social, motora).
    * Consulta rápida do histórico de anotações por aluno.
      
![Alunos](https://github.com/user-attachments/assets/2118df75-48e6-493a-8e47-c379ba51c9ea)

* **Gestão de Professores (Acesso Diretor):**
    * Cadastro, edição e exclusão de perfis de professores, incluindo seus dados de acesso e a sala de atuação.
* **Relatório Geral (Acesso Diretor):**
    * Visão consolidada e acesso a dados importantes para a gestão pedagógica e administrativa.

![relatorios](https://github.com/user-attachments/assets/e8ac8fcc-2f18-4d6e-92ca-c10a02fc2692)

## Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e plataformas:

* **Frontend:**
    * [**React Native**](https://reactnative.dev/) com [**Expo Go**](https://expo.dev/expo-go)
    * Linguagem: JavaScript
* **Backend (API):**
    * [**Google Apps Script**](https://developers.google.com/apps-script)
    * Funções personalizadas para interação com Google Sheets e Google Drive.
* **Banco de Dados:**
    * [**Google Sheets**](https://www.google.com/sheets/about/) (planilhas para armazenamento estruturado de dados).
* **Armazenamento de Arquivos:**
    * [**Google Drive**](https://www.google.com/drive/) (para fotos de alunos).
 
## Arquitetura da Solução

O sistema opera em uma arquitetura de três camadas principais:

![Diagrama](https://github.com/user-attachments/assets/19ea163d-0b10-4e32-a052-c50769128bba)



O aplicativo React Native envia requisições para um Web App publicado no Google Apps Script. Este Web App, por sua vez, interage diretamente
com planilhas específicas no Google Sheets para gerenciar os dados dos alunos e professores, e com o Google Drive para armazenar e recuperar as fotos.
