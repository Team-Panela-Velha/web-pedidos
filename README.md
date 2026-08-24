# RMS — Sistema de Gerenciamento do Restaurante

Interface web administrativa do sistema de pedidos e comandas.
Consome a API Spring Boot — nunca acessa o banco diretamente.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) — instale globalmente caso não tenha:

```bash
npm install -g pnpm
```

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositório>
cd web-pedidos
pnpm install
```

Na primeira vez pode aparecer este aviso:

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild, msw
```

Se aparecer, rode:

```bash
pnpm approve-builds
```

Selecione **esbuild** e **msw** com espaço e confirme. Só precisa fazer isso uma vez.

---

## Configuração

Crie um arquivo `.env` na raiz do projeto (não sobe pro git):

```text
VITE_API_URL=http://localhost:8080
```

Substitua pela URL real da API Spring Boot.
Sem o `.env`, o projeto usa uma API de demonstração automaticamente (funcional para desenvolvimento inicial).

---

## Rodando o projeto

```bash
pnpm dev
```

Abre em `http://localhost:5173`.

Na tela de login, enquanto a autenticação real não está conectada à API, qualquer usuário e senha não vazios funcionam.

---

## Scripts disponíveis

| comando | o que faz |
|---|---|
| `pnpm dev` | servidor de desenvolvimento com hot reload |
| `pnpm build` | gera o build de produção na pasta `dist/` |
| `pnpm start` | serve o build de produção localmente para testar |

---

## Estrutura do projeto

```
src/
├── App.tsx                  # raiz da aplicação: Refine + rotas + resources
├── index.tsx                # entrypoint do React
├── App.css                  # tema global (Tailwind v4 + CSS variables do shadcn)
├── pages/
│   ├── dashboard/           # página inicial — painel com indicadores
│   ├── categories/          # CRUD de categorias (exemplo funcional)
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── components/
│   ├── ui/                  # componentes shadcn/ui
│   └── refine-ui/           # layout, tabela, formulários integrados ao Refine
├── providers/
│   ├── auth.ts              # autenticação (stub — conectar à API)
│   ├── data.ts              # data provider REST
│   └── constants.ts         # API_URL lida do .env
├── hooks/
└── lib/
    └── utils.ts             # utilitário cn() para classes Tailwind
```

---

## Tecnologias

| tecnologia | versão | função |
|---|---|---|
| [React](https://react.dev/) | 19 | UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | tipagem estática |
| [Vite](https://vitejs.dev/) | 6 | bundler / dev server |
| [Refine](https://refine.dev/) | 5 | framework CRUD, auth, roteamento |
| [Tailwind CSS](https://tailwindcss.com/) | **v4** | estilização utilitária |
| [shadcn/ui](https://ui.shadcn.com/) | — | componentes de UI (sobre Tailwind + Radix) |
| [React Router](https://reactrouter.com/) | 7 | roteamento |
| [Lucide React](https://lucide.dev/) | — | ícones |

### Sobre o Tailwind v4

Este projeto usa **Tailwind v4**, que é diferente da v3:

- **Não existe `tailwind.config.js`** — a configuração de tema fica em `src/App.css` dentro do bloco `@theme`
- A importação é `@import "tailwindcss"` (não mais `@tailwind base/components/utilities`)
- Configurado como plugin do Vite em `vite.config.ts` — não precisa mexer no PostCSS
- As cores e variáveis do shadcn ficam como CSS variables no mesmo `App.css`

Para customizar o tema (cores, bordas, fontes), edite `src/App.css`.

### shadcn/ui — o que é e por que importa

Se você só usou React + Tailwind puro até agora, precisa saber isso:

**shadcn/ui é uma coleção de componentes React prontos, feitos com Tailwind.** Em vez de estilizar um `<button>` do zero, você usa `<Button>`, `<Card>`, `<Dialog>`, etc.

A diferença de outras bibliotecas (como Material UI) é que os componentes **ficam no próprio projeto**, em `src/components/ui/`. Dá pra abrir e editar qualquer um deles diretamente.

Este projeto já vem com ~30 componentes instalados. **Toda a interface usa shadcn** — sidebar, header, tabelas, formulários, cards, botões. Se você abrir qualquer página e ver imports de `@/components/ui/...`, é shadcn.

Como usar em uma página nova:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const MinhaPage = () => (
  <Card>
    <CardHeader>
      <CardTitle>Olá</CardTitle>
    </CardHeader>
    <CardContent>
      <Button>Clique aqui</Button>
    </CardContent>
  </Card>
)
```

Para adicionar um componente que ainda não está instalado:

```bash
pnpm dlx shadcn@latest add <componente>
# exemplos:
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add dialog
```

Documentação completa: [ui.shadcn.com/docs](https://ui.shadcn.com/docs)

---

## Referência rápida pnpm

| ação | comando |
|---|---|
| instalar dependências | `pnpm install` |
| adicionar pacote | `pnpm add <pacote>` |
| adicionar devDependency | `pnpm add -D <pacote>` |
| remover pacote | `pnpm remove <pacote>` |
| rodar CLI sem instalar | `pnpm dlx <comando>` |

---

## Importantes

- O frontend **nunca acessa o banco diretamente** — tudo passa pela API REST
- Regras de negócio críticas ficam no backend (Spring Boot)
- O `authProvider` em `src/providers/auth.ts` é um stub — precisa ser conectado à API real para autenticação por perfil funcionar
- Variáveis de ambiente com prefixo `VITE_` ficam disponíveis no frontend; sem esse prefixo, não ficam
