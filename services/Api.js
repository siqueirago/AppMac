// API para comunicação com o Google Apps Script

const API_URL = 'https://script.google.com/macros/s/AKfycbzFZbpJDOfUNT0A_oifstrisFR12N8H0_YYS_3D79VZ1PJkePKxeiQQPYLoIdDchVfaoQ/exec'; // Substitua se mudar o link depois

// Login
export const loginProfessor = async (email, senha) => {
  const response = await fetch(`${API_URL}?action=loginProfessor&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
  return response.json();
};

// Buscar todos os alunos (usado para Diretor)
export const buscarAlunos = async () => {
  const response = await fetch(`${API_URL}?action=listarAlunos&sala=Todas`);
  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map((aluno) => ({
      id: aluno.ID,
      nome: aluno.NOME,
      turma: aluno.TURMA,
      escola: aluno.ESCOLA,
      sala: aluno.SALA,
      foto: aluno.FOTO,
      anotacoes: aluno.ANOTACOES || '',
    }));
  } else {
    throw new Error('Erro ao carregar alunos');
  }
};

// Buscar alunos por sala (usado para Professor)
export const buscarAlunosPorSala = async (sala) => {
  const response = await fetch(`${API_URL}?action=listarAlunos&sala=${encodeURIComponent(sala)}`);
  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map((aluno) => ({
      id: aluno.ID,
      nome: aluno.NOME,
      turma: aluno.TURMA,
      escola: aluno.ESCOLA,
      sala: aluno.SALA,
      foto: aluno.FOTO,
      anotacoes: aluno.ANOTACOES || '',
    }));
  } else {
    throw new Error('Erro ao carregar alunos');
  }
};

// Adicionar novo aluno (Diretor)
export const adicionarAluno = async (aluno) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'addAluno',
      nome: aluno.nome,
      turma: aluno.turma,
      escola: aluno.escola,
      sala: aluno.sala,
      foto: aluno.foto,
    }),
  });
  return response.json();
};

// Editar dados de aluno (Diretor)
export const editarAluno = async (aluno) => {
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
      foto: aluno.foto,
    }),
  });
  return response.json();
};

// Registar anotações de um aluno (Professor ou Diretor)
export const adicionarAnotacao = async (
  alunoId, anotacaoTexto, nomeProfessor, alunoNome, alunoSala, linguagens,cognicao, social, motora) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
        
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao adicionar anotação:", error);
    return { success: false, message: 'Erro ao comunicar com o servidor.' };
  }
};

// Nova função para listar professores
export const listarProfessores = async () => {
  const response = await fetch(`${API_URL}?action=listarProfessores`);
  const data = await response.json();
  //console.log('Resposta da API listarProfessores:', JSON.stringify(data, null, 2)); // Adicione este log

  if (Array.isArray(data)) {
    return data.map((professor) => ({
      email: professor.Email,
      nome: professor.Nome,
      sala: professor.Sala,
      perfil: professor.Perfil,
    }));
  } else {
    throw new Error('Erro ao carregar professores');
  }
};

// Adicionar novo professor
export const adicionarProfessor = async (professor) => {
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
  return response.json();
};
// Editar professor existente
export const editarProfessor = async (professor) => {
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
  return response.json();
};

// Excluir professor
export const excluirProfessor = async (email) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'deleteProfessor',
      email: email,
    }),
  });
  return response.json();
};