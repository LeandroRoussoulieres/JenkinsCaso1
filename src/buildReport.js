const fs = require('node:fs');
const path = require('node:path');

// Nota: Certifique-se de que loadJson, validateDataset, summarize e ensureDir 
// estão declaradas ou importadas no seu arquivo.

function main() {
  const dataset = loadJson('data/candidatos.json');
    
  const errors = validateDataset(dataset);
  if (errors.length > 0) {
    throw new Error(`build interrompido: ${errors.length} erro(s) de dados`);
  }
    
  const summary = summarize(dataset);
  
  const approved = dataset.candidates
    .filter((candidate) => candidate.status === 'APROVADO')
    .map(({ registration, name, score }) => ({ registration, name, score }));
  
  ensureDir('dist');
  fs.copyFileSync('public/index.html', path.join('dist', 'index.html'));
     
  const report = {
    process: dataset.metadata.processo,
    version: dataset.metadata.version,
    generatedAt: new Date().toISOString(),
    summary,
    approved
  };
  
  // CORREÇÃO: Fechamento correto do JSON.stringify e da função writeFileSync.
  // Não é necessário usar crase (template string) aqui, basta passar o retorno do stringify.
  fs.writeFileSync('dist/relatorio.json', JSON.stringify(report, null, 2));
  
  // CORREÇÃO: Quebra de linha acidental removida para manter o log na mesma linha
  console.log(`RELATÓRIO GERADO: ${approved.length} aprovados de ${summary.total} candidatos`);
}

// Para que o script rode, você precisará chamar a função main():
// main();