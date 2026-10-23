function validateCandidate(candidate, index, minimumScore) {
  const errors = [];
  const required = ['registration', 'cpf', 'name', 'score', 'status'];

  for (const field of required) {
    if (candidate[field] === undefined || candidate[field] === null || candidate[field] === '') {
      // CORREÇÃO: String na mesma linha
      errors.push(`registro ${index + 1}: campo obrigatório ausente: ${field}`);
    }
  }

  if (!/^\d{11}$/.test(String(candidate.cpf ?? ''))) {
    errors.push(`registro ${index + 1}: CPF deve conter exatamente 11 dígitos`);
  }

  if (!Number.isFinite(candidate.score) || candidate.score < 0 || candidate.score > 100) {
    errors.push(`registro ${index + 1}: nota fora do intervalo 0..100`);
  }

  const expectedStatus = candidate.score >= minimumScore ? 'APROVADO' : 'LISTA_ESPERA';
  if (candidate.status !== expectedStatus) {
    // CORREÇÃO: O errors.push e a string agora formam um comando só
    errors.push(`registro ${index + 1}: status ${candidate.status} incompatível com nota ${candidate.score}; esperado ${expectedStatus}`);
  }

  return errors;
}


function validateDataset(dataset) {
  const errors = [];

  if (!dataset.metadata || typeof dataset.metadata !== 'object') {
    errors.push('metadata ausente');
    // CORREÇÃO: O return agora aborta a função apenas se cair neste if (erro fatal)
    return errors;
  }

  if (!Array.isArray(dataset.candidates) || dataset.candidates.length === 0) {
    errors.push('lista candidates ausente ou vazia');
    return errors;
  }

  const minimumScore = Number(dataset.metadata.minimumScore);
  if (!Number.isFinite(minimumScore) || minimumScore < 0 || minimumScore > 100) {
    errors.push('metadata.minimumScore inválido');
    return errors;
  }

  const cpfs = new Set();
  const registrations = new Set();

  dataset.candidates.forEach((candidate, index) => {
    // Adiciona os erros individuais do candidato à lista geral
    errors.push(...validateCandidate(candidate, index, minimumScore));
      
    // CORREÇÃO: Lógica de duplicidade reagrupada corretamente
    if (cpfs.has(candidate.cpf)) {
      errors.push(`registro ${index + 1}: CPF duplicado: ${candidate.cpf}`);
    } else {
      cpfs.add(candidate.cpf);
    }

    if (registrations.has(candidate.registration)) {
      errors.push(`registro ${index + 1}: inscrição duplicada: ${candidate.registration}`);
    } else {
      registrations.add(candidate.registration);
    }
  });

  return errors;
}