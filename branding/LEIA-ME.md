# DJ José Silva — versão própria do YuE2 Studio

Esta pasta transforma o código do **YuE2 Studio** na app **DJ José Silva**.

O código original é o [YuE2 Studio](https://github.com/timoncool/YuE2-Studio), de
Ilya Timonin (Nerual Dreming), com licença **MIT**. A licença e os créditos ao
autor mantêm-se sempre na app, como a licença exige.

## Descarregar o instalador

Na página **Releases** deste repositório, a versão mais recente tem o ficheiro
`DJ-Jose-Silva_<versão>_x64-setup.exe`. É esse que se instala no Windows.

## Como é gerado

O workflow `.github/workflows/dj-jose-silva.yml` faz tudo no GitHub:

1. Vai buscar o código da **última versão publicada** do YuE2 Studio original.
2. Aplica a marca desta pasta (`aplicar-marca.mjs`).
3. Reaproveita o **motor já compilado** dessa mesma versão oficial (o motor não
   muda com o nome, e compilá-lo exigiria CUDA, Vulkan e muitas horas).
4. Compila a app, assina o instalador com a tua chave de atualizações e publica
   tudo nas Releases, incluindo o `latest.json` das atualizações automáticas.

Corre sozinho:
- sempre que algo muda nesta pasta `branding/`;
- todas as segundas-feiras, se o autor original tiver lançado uma versão nova;
- quando quiseres: separador **Actions → Instalador DJ José Silva → Run workflow**.

Não é preciso fazer "Sync fork": o workflow parte sempre da versão oficial mais recente.

## O segredo das atualizações (uma vez só)

As atualizações automáticas só aceitam instaladores assinados por ti. A chave
privada fica guardada como **segredo** do repositório (encriptada pelo GitHub,
nunca no código):

- **Settings → Secrets and variables → Actions → New repository secret**
- Nome: `DJJS_CHAVE_ATUALIZACOES`
- Valor: as duas linhas do ficheiro de chave (1.ª a chave, 2.ª a palavra-passe)

Guarda também uma cópia desse ficheiro num sítio seguro. Se a perderes, as
pessoas que já têm a app terão de instalar a versão seguinte à mão, uma vez.
A chave **pública** está em `marca.json` e pode ser vista por todos.

## O que o script muda

| O quê | Antes | Depois |
|---|---|---|
| Nome da app, janela e instalador | YuE2 Studio | DJ José Silva |
| Ícones da app e do instalador | logótipo YuE2 | vinil "Jose Silva" |
| Identificador da app no Windows | com.timoncool.yue2-studio | pt.oficialdjjosesilva.studio |
| Nome do executável | YuE2-Studio.exe | DJ-Jose-Silva.exe |
| Língua da interface | inglês por defeito | português de Portugal por defeito |
| Atualizações automáticas | repositório do autor | este repositório |
| Notícias e estatísticas anónimas | servidor do autor | desligadas |
| Página "Sobre" | autor original | o teu nome, o teu site e créditos ao original |

As definições estão em `marca.json`. Se o autor mudar algum dos sítios que o
script altera, o script **pára e diz qual**, em vez de gerar uma app meio
renomeada; nesse caso, basta ajustar o script.

## O que fica igual, de propósito

- **Pasta de dados** (`%LOCALAPPDATA%\YuE2 Studio`): se já tiveres o YuE2 Studio
  instalado, a app usa os modelos já descarregados, sem os voltar a descarregar.
- **Servidor MCP** em `http://127.0.0.1:8791/mcp`: é por aí que o Claude se liga à app.
- **Downloads dos componentes** (modelos, separação de pistas, etc.), que vêm dos
  sítios oficiais de onde a app os vai buscar.

## Atenção à licença do modelo

O código da app é MIT, mas os pesos do modelo YuE2 e do SheetSage2 são
**CC BY-NC 4.0**: as músicas geradas com eles são para uso **não comercial**.
Mudar o nome da app não muda isso.
