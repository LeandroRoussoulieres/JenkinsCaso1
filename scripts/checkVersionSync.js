// Nota: Certifique-se de que a função `readText` esteja definida no seu código. 
// Exemplo: const readText = (file) => fs.readFileSync(file, 'utf8').trim();

function main() {
  const versionFile = readText('version.txt');
  const packageVersion = JSON.parse(readText('package.json')).version;
  const dataVersion = JSON.parse(readText('data/candidatos.json')).metadata.version;
  const html = readText('public/index.html');
  const htmlMatch = html.match(/data-release-version="([^"]+)"/);
  const htmlVersion = htmlMatch ? htmlMatch[1] : null;

  // CORREÇÃO: As chaves / propriedades agora estão DENTRO da declaração do objeto
  const versions = {
    'version.txt': versionFile,
    'package.json': packageVersion,
    'data/candidatos.json': dataVersion,
    'public/index.html': htmlVersion
  };

  console.log('VERSÕES ENCONTRADAS');
  
  // CORREÇÃO: Movido para cima, para mostrar o que foi encontrado antes de (possivelmente) quebrar o script
  Object.entries(versions).forEach(([file, version]) => console.log(`- ${file}: ${version}`));

  const unique = new Set(Object.values(versions));
  
  // CORREÇÃO: O process.exit e os logs de erro agora estão DENTRO do bloco if
  if (unique.has(null) || unique.size !== 1) {
    console.error('SINCRONIZAÇÃO DE VERSÃO REPROVADA');
    console.error('Todos os artefatos devem declarar a mesma versão.');
    process.exit(1);
  }

  // CORREÇÃO: O process