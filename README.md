# Sistema de Gerenciamento Escolar - Educação infantil
Este projeto consiste no desenvolvimento de um aplicativo mobile voltado para a otimização e simplificação da gestão de alunos e do acompanhamento pedagógico no Centro de Educação Infantil (CEI) Maria Amaro Camelo. Ele faz parte de um trabalho de extensão acadêmica exigido pela faculdade Estácio de Sá, no contexto da disciplina "Programação Para Dispositivos Móveis em Android - Com React Native", pertencente ao curso de Análise e Desenvolvimento de Sistemas.

O objetivo principal da solução é modernizar as operações diárias da instituição, proporcionando uma ferramenta intuitiva para professores e diretores. Com o aplicativo, será possível gerenciar informações dos alunos, registrar observações sobre seu desenvolvimento e acessar dados essenciais de maneira eficiente e prática.

Para garantir flexibilidade e acessibilidade, a arquitetura do sistema combina um frontend mobile com um backend dinâmico baseado em serviços do Google. Dessa forma, o aplicativo aproveita ferramentas familiares como Google Sheets e Google Drive, facilitando a integração e o uso no ambiente educacional.
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
## Considerações Finais
O desenvolvimento deste projeto me proporcionou uma valiosa jornada de aprendizado e superação de desafios técnicos. Desde a configuração correta do ambiente até a gestão de variáveis sensíveis por meio dos arquivos .env e app.config.js, cada etapa foi essencial para garantir a segurança e eficiência do sistema.

Além disso, a comunicação integrada com a API do Google Apps Script exigiu soluções estratégicas para assegurar um fluxo de dados confiável. A resolução de problemas comuns em ambientes React Native, como falhas de rede e inconsistências no cache do bundler, contribuiu significativamente para o fortalecimento do conhecimento técnico e a robustez da aplicação.

A experiência adquirida neste processo demonstra a capacidade de integrar tecnologias diversas em um sistema coeso e funcional, evidenciando a versatilidade e adaptabilidade das soluções modernas.
Olhando para o futuro, o Sistema de Gerenciamento Escolar  possui um vasto potencial para expansão. Novas funcionalidades, como módulos de comunicação com pais, agendamento de eventos, acompanhamento financeiro simplificado, ou até mesmo integrações com outras plataformas educacionais, poderiam enriquecer ainda mais a experiência.

Em suma, este projeto não é apenas um software; é uma ferramenta de transformação que promete trazer maior organização, eficiência e um suporte mais robusto para a dedicada equipe do CEI Maria Amaro Camelo, contribuindo diretamente para um ambiente educacional mais dinâmico e conectado.
## Autor
👨‍🎓 Júlio César Gomes Siqueira
## Contato
📧 [E-mail](siqueiragomes123@gmail.com)

📞[Whatsaap](https://wa.me/5585981304584)
 
