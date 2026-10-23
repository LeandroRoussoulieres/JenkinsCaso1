test('aceita lote consistente', () => {
  assert.deepEqual(validateDataset(validDataset()), []);
});

test('rejeita CPF duplicado', () => {
  const dataset = validDataset();
  dataset.candidates[1].cpf = dataset.candidates[0].cpf;
  assert.match(validateDataset(dataset).join('\n'), /CPF duplicado/);
});

test('rejeita nota fora do intervalo', () => {
  const dataset = validDataset();
  dataset.candidates[0].score = 110;
  // CORREÇÃO: O assert voltou para DENTRO do teste
  assert.match(validateDataset(dataset).join('\n'), /nota fora do intervalo/);
});

test('rejeita status incompatível com a nota', () => {
  const dataset = validDataset();
  dataset.candidates[0].status = 'LISTA_ESPERA';
  // CORREÇÃO: O assert voltou para DENTRO do teste
  assert.match(validateDataset(dataset).join('\n'), /status .* incompatível/);
});

test('resume aprovados e lista de espera', () => {
  assert.deepEqual(summarize(validDataset()), { total: 2, approved: 1, waiting: 1 });
});