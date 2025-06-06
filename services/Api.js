import Constants from 'expo-constants';

// Define a API_URL a partir das variáveis de ambiente do Expo
const API_URL = Constants.expoConfig.extra.googleAppsScriptUrl;

// --- FUNÇÕES DE API ---

// Login
export const loginProfessor = async (email, senha) => {
  try {
    const url = `${API_URL}?action=loginProfessor&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`;
    // console.log('API Request (Login):', url); // Comentado para evitar log excessivo
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API (Login):", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    // console.log('API Response (Login):', data); // Comentado
    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error; // Re-lança o erro para ser tratado no componente
  }
};

// Função auxiliar para mapear dados de aluno (para evitar repetição)
const mapAlunoData = (aluno) => ({
  id: aluno.id, 
  nome: aluno.nome,
  turma: aluno.turma,
  escola: aluno.escola,
  sala: aluno.sala,
  foto: aluno.foto,
  anotacoes: aluno.anotacoes || '',
});

// Buscar todos os alunos (usado para Diretor)
export const buscarAlunos = async () => {
  try {
    const url = `${API_URL}?action=listarAlunos&sala=Todas`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API (buscarAlunos):", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map(mapAlunoData); // Usa a função auxiliar para mapear os dados
    } else {
      console.error('Dados de alunos não são um array:', data);
      throw new Error('Formato de dados inesperado ao carregar alunos.');
    }
  } catch (error) {
    console.error("Erro ao buscar todos os alunos:", error);
    throw error;
  }
};

// Buscar alunos por sala (usado para Professor)
export const buscarAlunosPorSala = async (sala) => {
  try {
    const url = `${API_URL}?action=listarAlunos&sala=${encodeURIComponent(sala)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API (buscarAlunosPorSala):", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map(mapAlunoData); // Usa a função auxiliar
    } else {
      console.error('Dados de alunos por sala não são um array:', data);
      throw new Error('Formato de dados inesperado ao carregar alunos por sala.');
    }
  } catch (error) {
    console.error("Erro ao buscar alunos por sala:", error);
    throw error;
  }
};

// Adicionar novo aluno (Diretor)
export const adicionarAluno = async (aluno) => {
  try {
    const requestBody = { // Crie o objeto do corpo separadamente
      action: 'addAluno',
      nome: aluno.nome,
      turma: aluno.turma,
      escola: aluno.escola,
      sala: aluno.sala,
      fotoBase64: aluno.fotoBase64,
    };
    console.log('API Request (adicionarAluno) - Body sendo enviado:', JSON.stringify(requestBody)); // Log adicional
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' // Adicione esta linha
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) { // Adicione esta verificação para erros HTTP não-200
        const errorText = await response.text();
        console.error("Erro na resposta da API (adicionarAluno - HTTP):", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log('API Response (adicionarAluno):', data);
    return data;
  } catch (error) {
    console.error("Erro ao adicionar aluno:", error);
    throw error;
  }
};

// Faça a mesma alteração para editarAluno:
export const editarAluno = async (aluno) => {
    try {
        console.log('API Request (editarAluno) - Dados recebidos:', aluno); // Log para ver o que chegou

        let photoPayload = {};

        // Prioriza a nova foto em Base64 se ela existir
        if (aluno.fotoBase64) {
            photoPayload.fotoBase64 = aluno.fotoBase64;
            console.log('API Request (editarAluno): Nova foto Base64 detectada para upload.');
        } 
        // Caso contrário, se uma URL de foto existente foi fornecida, usa-a
        else if (aluno.foto) { // aluno.foto contém a URL da foto existente
            photoPayload.foto = aluno.foto;
            console.log('API Request (editarAluno): Usando URL de foto existente:', aluno.foto);
        } else {
            // Se nem fotoBase64 nem foto foram fornecidos, pode significar que a foto foi removida
            // ou não havia foto para o aluno. Envie 'null' ou uma string vazia para limpar no Apps Script.
            // Isso depende de como seu Apps Script trata 'foto' quando é null/undefined.
            // Vou enviar explicitamente para 'null' para indicar que não há foto.
            photoPayload.foto = null; 
            console.log('API Request (editarAluno): Nenhuma foto Base64 ou URL fornecida. Definindo foto como null.');
        }

        const requestBody = {
            action: 'editAluno',
            id: aluno.id,
            nome: aluno.nome,
            turma: aluno.turma,
            escola: aluno.escola,
            sala: aluno.sala,
            ...photoPayload, // Espalha as propriedades de foto/fotoBase64 aqui
        };

        console.log('API Request (editarAluno) - Body sendo enviado:', JSON.stringify(requestBody));

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' // Boa prática
            },
            body: JSON.stringify(requestBody),
        });

        // Verificação de status HTTP da resposta
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro na resposta da API (editarAluno - HTTP):", response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API Response (editarAluno):', data);
        return data;
    } catch (error) {
        console.error("Erro ao editar aluno:", error);
        throw error; // Re-lança o erro para ser tratado pelo componente chamador
    }
};

// Excluir aluno
export const excluirAluno = async (alunoId) => {
  try {
    console.log('API Request (excluirAluno) - ID:', alunoId);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        action: 'excluirAluno',
        id: alunoId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API (excluirAluno):", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response (excluirAluno):', data);
    return data;
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    throw error;
  }
};

// Registar anotações de um aluno (Professor ou Diretor)
export const adicionarAnotacao = async (
  alunoId, anotacaoTexto, nomeProfessor, alunoNome, alunoSala, linguagens, cognicao, social, motora) => {
  try {
    const requestBody = {
      action: 'adicionarAnotacao',
      id: alunoId,
      nome: alunoNome,
      sala: alunoSala,
      professor: nomeProfessor,
      anotacao: anotacaoTexto,
      linguagens: linguagens,
      cognicao: cognicao,
      social: social,
      motora: motora,
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    console.log('API Response (adicionarAnotacao):', data);
    return data;
  } catch (error) {
    console.error("Erro ao adicionar anotação:", error);
    return { success: false, message: 'Erro ao comunicar com o servidor.' };
  }
};

// Função auxiliar para mapear dados de professor (para evitar repetição)
const mapProfessorData = (professor) => ({
  email: professor.email, 
  senha: professor.senha,
  nome: professor.nome,
  sala: professor.sala,
  perfil: professor.perfil,
});

export const listarProfessores = async () => {
  try {
    const url = `${API_URL}?action=listarProfessores`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API (listarProfessores):", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response (listarProfessores):', data);

    if (Array.isArray(data)) {
      return data.map(mapProfessorData);
    } else {
      console.error('Dados de professores não são um array:', data);
      throw new Error('Formato de dados inesperado ao carregar professores.');
    }
  } catch (error) {
    console.error("Erro ao carregar professores:", error);
    throw error;
  }
};

// Adicionar novo professor
export const adicionarProfessor = async (professor) => {
  try {
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addProfessor',
        email: professor.email,
        senha: professor.senha,
        nome: professor.nome,
        sala: professor.sala,
        perfil: professor.perfil,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao adicionar professor:", error);
    throw error;
  }
};

// Editar professor existente
export const editarProfessor = async (professor) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'editProfessor',
        emailOriginal: professor.emailOriginal, // <- correto aqui
        email: professor.email,                // <- novo email do professor (caso mude)
        senha: professor.senha,
        nome: professor.nome,
        sala: professor.sala,
        perfil: professor.perfil,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao editar professor:", error);
    throw error;
  }
};

// Excluir professor
export const excluirProfessor = async (email) => {
  try {
    console.log('API Request (excluirProfessor) Email:', email);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deleteProfessor',
        email: email,
      }),
    });
    const data = await response.json();
    console.log('API Response (excluirProfessor):', data);
    return data;
  } catch (error) {
    console.error("Erro ao excluir professor:", error);
    throw error;
  }
};

export const buscarRelatorio = async () => {
  const response = await fetch(`${API_URL}?action=listarRelatorio`);
  if (!response.ok) throw new Error('Erro ao buscar relatório');
  return await response.json();
};
