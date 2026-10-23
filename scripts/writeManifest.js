const fs = require('node:fs');
const crypto = require('node:crypto');
const { execSync } = require('node:child_process');

function sha256(file) {
  // CORREÇÃO: O retorno e a expressão devem estar na mesma linha,
  // ou a quebra de linha deve acontecer DEPOIS de iniciar a expressão.
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
  
function git(command, fallback = 'indisponivel') {
  // CORREÇÃO: O try/catch deve ficar DENTRO do corpo da função
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch {
    return fallback;
  }
}

const manifest = {
  application: 'portal-resultados-ci',
  version: fs.readFileSync('version.txt', 'utf8').trim(),
  commit: process.env.GIT_COMMIT || git('git rev-parse HEAD'),
  branch: process.env.GIT_BRANCH || git('git branch --show-current'),
  buildNumber: process.env.BUILD_NUMBER || 'local',
  generatedAt: new Date().toISOString(),
  artifacts: { 
    'index.html': sha256('dist/index.html'),
    'relatorio.json': sha256('dist/relatorio.json')
  }
};

// CORREÇÃO: Fechamento correto do JSON.stringify (adicionado o '2' para indentação),
// fechamento da crase e fechamento dos parênteses da função.
fs.writeFileSync('dist/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`MANIFESTO GERADO PARA O COMMIT ${manifest.commit}`);