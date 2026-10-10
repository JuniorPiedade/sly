# isly.me — MVP de identidade digital gamer/geek

Este projeto é a primeira interface funcional do isly.me: um editor de perfil com status, emblemas, temas e links, com pré-visualização em tempo real.

## O que funciona nesta versão
- Editar nome, @ desejado, biografia e avatar por URL/emoji.
- Escolher um status e informar jogo/atividade.
- Selecionar até três emblemas decorativos.
- Alternar entre Cyber Neon, Sakura.exe e Matrix Core.
- Adicionar/remover até seis links.
- Ver a prévia mudar em tempo real.
- Salvar os dados no `localStorage` do navegador.

## O que ainda NÃO está conectado
- Cadastro e login reais.
- Banco de dados ou sincronização entre dispositivos.
- Endereços públicos reais como `isly.me/nyx`.
- Verificação automática de conquistas.
- Upload de imagens; o avatar aceita URL pública ou emoji.

Esses itens serão implementados em etapas seguintes, com Supabase e publicação na Vercel. Não use dados sensíveis nesta demonstração.

## Como publicar pelo GitHub + Vercel (sem terminal)

1. Baixe e extraia `isly-me-mvp.zip` no computador.
2. No GitHub, crie um repositório novo chamado `isly-me` (pode ser público ou privado).
3. Abra o repositório e clique em **Add file → Upload files**.
4. Envie `index.html`, `vercel.json` e `README.md` (os arquivos, não apenas a pasta ZIP).
5. Clique em **Commit changes**.
6. Entre na Vercel e escolha **Add New → Project**.
7. Importe o repositório `isly-me`.
8. Como é um site estático, não precisa de build command. A Vercel deve detectar os arquivos estáticos; se solicitar configurações, deixe Build Command vazio e Output Directory como `.`.
9. Clique em **Deploy**.

## Teste local rápido
Abra o arquivo `index.html` no navegador. O editor funciona sem instalação e sem servidor.

## Próxima etapa de desenvolvimento
1. Criar projeto Supabase.
2. Implementar autenticação e tabelas com políticas de segurança (RLS).
3. Salvar perfis, status, emblemas e links no banco.
4. Criar páginas públicas por slug e conectar domínio.
