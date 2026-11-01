#!/usr/bin/env node
// Aplica a marca "DJ José Silva" ao código do YuE2 Studio.
//
// Uso:  node branding/aplicar-marca.mjs            (aplica na pasta do repositório)
//       node branding/aplicar-marca.mjs --verificar (só verifica, não altera nada)
//
// Pode correr-se várias vezes: o que já estiver aplicado é saltado.
// Se o autor original mudar um dos sítios que este script altera, o script
// pára com uma mensagem a dizer qual — nada é aplicado pela metade sem aviso.
//
// O código original é do YuE2 Studio, de Ilya Timonin (Nerual Dreming),
// sob licença MIT. A licença e os créditos ficam sempre na app.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const marca = JSON.parse(readFileSync(join(raiz, 'branding', 'marca.json'), 'utf8'));
const soVerificar = process.argv.includes('--verificar');

const NOME = marca.nome;
const ORIGINAL = marca.original.nome;
const REPO = `https://github.com/${marca.repositorio}`;
const REPO_ORIGINAL = `https://github.com/${marca.original.repositorio}`;

const ficheiros = new Map(); // caminho -> { antes, depois }
const problemas = [];
let aplicados = 0;
let jaFeitos = 0;

function ler(caminho) {
  if (!ficheiros.has(caminho)) {
    const completo = join(raiz, caminho);
    if (!existsSync(completo)) {
      problemas.push(`${caminho}: o ficheiro já não existe no código original.`);
      ficheiros.set(caminho, { antes: null, depois: null });
    } else {
      const texto = readFileSync(completo, 'utf8');
      ficheiros.set(caminho, { antes: texto, depois: texto });
    }
  }
  return ficheiros.get(caminho);
}

/**
 * Troca `procurar` por `trocar` num ficheiro.
 * - todas: troca todas as ocorrências (senão exige exatamente uma).
 * - feito: texto que prova que a troca já foi feita (por defeito, `trocar`).
 */
function trocar(caminho, procurar, novo, { todas = false, feito = novo } = {}) {
  const f = ler(caminho);
  if (f.depois === null) return;
  // Quando o texto novo contém o antigo (acrescentos), só a marca `feito` diz se já foi aplicado.
  if (novo.includes(procurar) && f.depois.includes(feito)) { jaFeitos++; return; }
  const n = f.depois.split(procurar).length - 1;
  if (n === 0) {
    if (f.depois.includes(feito)) jaFeitos++;
    else problemas.push(`${caminho}: não encontrei «${resumo(procurar)}». O autor original mudou este sítio; o script tem de ser ajustado.`);
    return;
  }
  if (!todas && n > 1) {
    problemas.push(`${caminho}: «${resumo(procurar)}» aparece ${n} vezes e esperava 1.`);
    return;
  }
  f.depois = f.depois.split(procurar).join(novo);
  aplicados++;
}

/** Altera um ficheiro JSON com uma função. */
function json(caminho, alterar) {
  const f = ler(caminho);
  if (f.depois === null) return;
  const dados = JSON.parse(f.depois);
  const antes = JSON.stringify(dados);
  alterar(dados);
  if (JSON.stringify(dados) === antes) { jaFeitos++; return; }
  f.depois = JSON.stringify(dados, null, 2) + '\n';
  aplicados++;
}

const resumo = (s) => (s.length > 70 ? s.slice(0, 67) + '…' : s).replace(/\n/g, '⏎');

// ── 1. Nome, identificador e atualizações da app de Windows ──────────────────

json('desktop/src-tauri/tauri.conf.json', (c) => {
  c.productName = NOME;
  c.identifier = marca.identificador;
  c.mainBinaryName = marca.nomeFicheiro;
  for (const janela of c.app?.windows ?? []) janela.title = NOME;
  if (c.plugins?.updater) {
    c.plugins.updater.endpoints = [`${REPO}/releases/latest/download/latest.json`];
  }
});

// A configuração usada nas versões publicadas: as atualizações vêm do teu repositório.
trocar('desktop/src-tauri/tauri.release.conf.template.json',
  `${REPO_ORIGINAL}/releases/latest/download/latest.json`,
  `${REPO}/releases/latest/download/latest.json`);

trocar('desktop/src-tauri/src/lib.rs',
  `const RELEASES_URL: &str = "${REPO_ORIGINAL}/releases/latest";`,
  `const RELEASES_URL: &str = "${REPO}/releases/latest";`);
trocar('desktop/src-tauri/src/lib.rs', `"Quit ${ORIGINAL}"`, `"Quit ${NOME}"`);

// O script de publicação: nomes dos ficheiros e endereço das atualizações.
trocar('scripts/build-release.ps1',
  `url = "${REPO_ORIGINAL}/releases/download/v$Version/$assetName"`,
  `url = "${REPO}/releases/download/v$Version/$assetName"`);
trocar('scripts/build-release.ps1', `"YuE2-Studio-$Version-portable"`, `"${marca.nomeFicheiro}-$Version-portable"`);
trocar('scripts/build-release.ps1', `"YuE2-Studio-$Version-portable-windows-x64.zip"`, `"${marca.nomeFicheiro}-$Version-portable-windows-x64.zip"`);

// ── 2. Nome visível na interface ─────────────────────────────────────────────

trocar('app/index.html', ORIGINAL, NOME, { todas: true });
trocar('app/components/Sidebar.tsx', `"${ORIGINAL}"`, `"${NOME}"`, { todas: true });
trocar('app/components/Sidebar.tsx', `>${ORIGINAL}</span>`, `>${NOME}</span>`);
trocar('app/App.tsx', `>${ORIGINAL}</p>`, `>${NOME}</p>`);
trocar('app/components/ShareModal.tsx', ORIGINAL, NOME, { todas: true });
trocar('app/components/VideoGeneratorModal.tsx', `song.creator || '${ORIGINAL}'`, `song.creator || '${NOME}'`);
trocar('app/services/programs.ts', `yue2: '${ORIGINAL}',`, `yue2: '${NOME}',`);
// Textos da interface (boas-vindas, avisos, e-mail de partilha) em todas as línguas.
trocar('app/i18n/yue2.ts', ORIGINAL, NOME, { todas: true });

// ── 3. "Sobre": o teu nome, os créditos ao autor original e os teus links ────

trocar('app/components/SettingsModal.tsx',
  `<p className="text-zinc-900 dark:text-white">${ORIGINAL} · {t('version')} {__APP_VERSION__}</p>`,
  `<p className="text-zinc-900 dark:text-white">${NOME} · {t('version')} {__APP_VERSION__}</p>`);
trocar('app/components/SettingsModal.tsx',
  `<p className="text-xs text-zinc-400 dark:text-zinc-500">{t('poweredBy')}</p>`,
  `<p className="text-xs text-zinc-400 dark:text-zinc-500">{t('poweredBy')}</p>\n` +
  `                  <p className="text-xs text-zinc-400 dark:text-zinc-500">Baseado no ${ORIGINAL} de ${marca.original.autor} · licença ${marca.original.licenca}</p>\n` +
  `                  <p className="text-xs"><a href="${marca.site}" target="_blank" rel="noopener noreferrer" className="underline">${marca.site.replace(/^https?:\/\//, '')}</a></p>`,
  { feito: `Baseado no ${ORIGINAL} de` });
trocar('app/components/SettingsModal.tsx', `<SiGithub size={14} />${ORIGINAL}\n`, `<SiGithub size={14} />${ORIGINAL} (original)\n`);
trocar('app/components/SettingsModal.tsx',
  `issueReportUrl('${REPO_ORIGINAL}'`,
  `issueReportUrl('${REPO}'`);

// ── 4. Notícias e estatísticas do servidor do autor: desligadas ──────────────
// A app pedia notícias ao servidor do autor de hora a hora e enviava
// estatísticas anónimas. Na versão DJ José Silva isso fica desligado.
// (Para voltar a ligar num teste: variável de ambiente DJJS_LIGAR_HUB=1.)

if (marca.desligarNoticiasEEstatisticas) {
  trocar('crates/music-server/src/lib.rs',
    'fn start_hub() -> Option<studio_hub_client::Hub> {\n',
    'fn start_hub() -> Option<studio_hub_client::Hub> {\n' +
    '    // DJ José Silva: sem notícias nem estatísticas do servidor do autor original.\n' +
    '    if std::env::var_os("DJJS_LIGAR_HUB").is_none() {\n' +
    '        return None;\n' +
    '    }\n',
    { feito: 'DJJS_LIGAR_HUB' });
}

// ── Resultado ────────────────────────────────────────────────────────────────

if (problemas.length) {
  console.error('\nO script parou sem alterar nada, porque o código original mudou:\n');
  for (const p of problemas) console.error('  • ' + p);
  console.error('');
  process.exit(1);
}

const mudados = [...ficheiros].filter(([, f]) => f.antes !== f.depois);
if (soVerificar) {
  console.log(`Verificação OK: ${aplicados} alterações por aplicar, ${jaFeitos} já aplicadas.`);
} else {
  for (const [caminho, f] of mudados) writeFileSync(join(raiz, caminho), f.depois, 'utf8');
  console.log(`Marca "${NOME}" aplicada: ${aplicados} alterações em ${mudados.length} ficheiros (${jaFeitos} já estavam feitas).`);
}
