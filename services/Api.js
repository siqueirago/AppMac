// API para comunicação com o Google Apps Script
import Constants from 'expo-constants';

// Define a API_URL a partir das variáveis de ambiente do Expo
const API_URL = Constants.expoConfig.extra.googleAppsScriptUrl; 

// --- FUNÇÕES DE API ---

// Login
export const loginProfessor = async (email, senha) => {
  try {
    const url = `${API_URL}?action=loginProfessor&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`;
    console.log('API Request (Login):', url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API (Login):", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log('API Response (Login):', data);
    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error; // Re-lança o erro para ser tratado no componente
  }
};

// Função auxiliar para mapear dados de aluno (para evitar repetição)
const mapAlunoData = (aluno) => ({
  id: aluno.id, // CORRIGIDO: minúsculas
  nome: aluno.nome, // CORRIGIDO: minúsculas
  turma: aluno.turma, // CORRIGIDO: minúsculas
  escola: aluno.escola, // CORRIGIDO: minúsculas
  sala: aluno.sala, // CORRIGIDO: minúsculas
  foto: aluno.foto, // CORRIGIDO: minúsculas
  anotacoes: aluno.anotacoes || '', // CORRIGIDO: minúsculas
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
      return data.map(mapAlunoData); // Usa a função auxiliar
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
    console.log('API Request (adicionarAluno):', aluno);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addAluno',
        nome: aluno.nome,
        turma: aluno.turma,
        escola: aluno.escola,
        sala: aluno.sala,
        fotoBase64: aluno.fotoBase64, // <<< MUDANÇA AQUI! De 'foto' para 'fotoBase64'
      }),
    });
    const data = await response.json();
    console.log('API Response (adicionarAluno):', data);
    return data;
  } catch (error) {
    console.error("Erro ao adicionar aluno:", error);
    throw error;
  }
};

// Modifique também editarAluno para usar fotoBase64 quando aplicável
export const editarAluno = async (aluno) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'editAluno',
                id: aluno.id,
                nome: aluno.nome,
                turma: aluno.turma,
                escola: aluno.escola,
                sala: aluno.sala,
                // Use fotoBase64 se estiver presente, caso contrário, use a foto existente
                fotoBase64: aluno.fotoBase64 || undefined, // Envia fotoBase64 se houver
                foto: !aluno.fotoBase64 ? aluno.foto : undefined, // Envia foto existente APENAS se não houver fotoBase64 nova
            }),
        });
        const data = await response.json();
        console.log('API Response (editarAluno):', data);
        return data;
    } catch (error) {
        console.error("Erro ao editar aluno:", error);
        throw error;
    }
};
// Excluir aluno (Diretor)
export const excluirAluno = async (alunoId) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'excluirAluno',
        id: alunoId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    // Retorna um objeto de erro consistente para o componente que chamou
    return { success: false, message: 'Falha na conexão ao tentar excluir aluno.' }; 
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
  email: professor.email, // CORRIGIDO: minúsculas
  senha: professor.senha, // Se a senha for retornada, embora não seja recomendado para segurança
  nome: professor.nome,   // CORRIGIDO: minúsculas
  sala: professor.sala,   // CORRIGIDO: minúsculas
  perfil: professor.perfil, // CORRIGIDO: minúsculas
});

export const listarProfessores = async () => {
  try {
    const url = `${API_URL}?action=listarProfessores`;
    console.log('API Request (listarProfessores):', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API (listarProfessores):", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response (listarProfessores):', data);

    if (Array.isArray(data)) {
      return data.map(mapProfessorData); // Usa a função auxiliar
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
    console.log('API Request (editarProfessor):', professor);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'editProfessor',
        email: professor.emailOriginal, // Usaremos o email original para identificar o professor a ser editado
        senha: professor.senha,
        nome: professor.nome,
        sala: professor.sala,
        perfil: professor.perfil,
      }),
    });
    const data = await response.json();
    console.log('API Response (editarProfessor):', data);
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