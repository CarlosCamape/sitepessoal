# Currículo — versão 4 revisada

Abra `index.html` no navegador, mantendo `style.css`, `script.js` e as três imagens
na mesma pasta. Não há dependências ou etapa de compilação.

Leia **REVISAO-COMPLETA.md**: diagnóstico, código integral dos três arquivos em
blocos separados, explicações, guia de personalização e checklist de testes.

O formulário é uma demonstração de validação no navegador. Ele prepara um rascunho
para um aplicativo externo de e-mail; não envia ou armazena mensagens no site.

Para testar por servidor local, execute nesta pasta:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://localhost:8000` no navegador. Pare o servidor com Ctrl+C.
Python é opcional: serve apenas para essa forma de teste local.

Para publicar, envie os arquivos desta pasta extraídos para o repositório.
O nome `index.html` já está correto para a página inicial.
