# DJ José Silva — versão própria do YuE2 Studio

Esta pasta transforma o código do **YuE2 Studio** na app **DJ José Silva**.

O código original é o [YuE2 Studio](https://github.com/timoncool/YuE2-Studio), de
Ilya Timonin (Nerual Dreming), com licença **MIT**. A licença (`LICENSE`) e os
créditos ao autor mantêm-se sempre na app, como a licença exige.

## Como funciona

Os ficheiros do autor original **não são alterados no repositório**. Só esta pasta
`branding/` é acrescentada. As mudanças são aplicadas no momento de gerar o
instalador, pelo script `aplicar-marca.mjs`.

Assim, quando o autor lança uma versão nova:

1. No GitHub, no teu repositório, carregas em **Sync fork → Update branch**.
   Como só acrescentámos ficheiros novos, nunca há conflitos.
2. Geras o instalador novo (o botão de gerar o instalador vem na próxima parte).
3. O script volta a aplicar o nome "DJ José Silva" ao código novo.

Se o autor mudar algum dos sítios que o script altera, o script **pára e diz
qual**, em vez de gerar uma app meio renomeada. Nesse caso, basta ajustar o script.

## O que o script muda

| O quê | Antes | Depois |
|---|---|---|
| Nome da app, janela e instalador | YuE2 Studio | DJ José Silva |
| Identificador da app no Windows | com.timoncool.yue2-studio | pt.oficialdjjosesilva.studio |
| Nome do executável | YuE2-Studio.exe | DJ-Jose-Silva.exe |
| Atualizações automáticas | repositório do autor | o teu repositório |
| Notícias e estatísticas anónimas | servidor do autor | desligadas |
| Página "Sobre" | autor original | o teu nome, o teu site e créditos ao original |
| Textos de boas-vindas, partilha e avisos | "YuE2 Studio" | "DJ José Silva" |

As definições estão em `marca.json` (nome, identificador, repositório, site).

## O que fica igual, de propósito

- **Pasta de dados** (`%LOCALAPPDATA%\YuE2 Studio`): se já tiveres o YuE2 Studio
  instalado, a app DJ José Silva usa os mesmos modelos já descarregados, sem
  voltar a descarregar dezenas de GB.
- **Servidor MCP** em `http://127.0.0.1:8791/mcp`: é por aí que o Claude se liga à app.
- **Downloads dos componentes** (motor, separação de pistas, etc.), que continuam
  a vir dos sítios oficiais de onde a app os vai buscar.

## Usar à mão

```
node branding/aplicar-marca.mjs --verificar   # só verifica
node branding/aplicar-marca.mjs               # aplica
```

Pode correr-se várias vezes sem problema.

## Atenção à licença do modelo

O código da app é MIT, mas os pesos do modelo YuE2 e do SheetSage2 são
**CC BY-NC 4.0**: as músicas geradas com eles são para uso **não comercial**.
Mudar o nome da app não muda isso.
