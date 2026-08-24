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

```bash
pnpm install
```

Se aparecer o aviso de builds ignorados, rode:

```bash
pnpm approve-builds
```

Selecione **esbuild** e **msw** e confirme.

---

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```text
VITE_API_URL=http://localhost:8080
```

Substitua pela URL real da API Spring Boot.
Sem o `.env`, o projeto usa uma API de demonstração automaticamente.

---

## Scripts

| comando | o que faz |
|---|---|
| `pnpm dev` | sobe o servidor de desenvolvimento (`http://localhost:5173`) |
| `pnpm build` | gera o build de produção na pasta `dist/` |
| `pnpm start` | serve o build de produção localmente |

---

## Referência rápida de comandos pnpm

| ação | comando |
|---|---|
| instalar dependências do projeto | `pnpm install` |
| adicionar um pacote | `pnpm add <pacote>` |
| adicionar como devDependency | `pnpm add -D <pacote>` |
| remover um pacote | `pnpm remove <pacote>` |
| rodar script do package.json | `pnpm <script>` |

---

## Tecnologias

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Refine](https://refine.dev/) — framework para CRUD, auth, roteamento
- [shadcn/ui](https://ui.shadcn.com/) — componentes de UI
- [Tailwind CSS](https://tailwindcss.com/)

---

## Documentação

- [Refine](https://refine.dev/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [React Router](https://reactrouter.com/)
