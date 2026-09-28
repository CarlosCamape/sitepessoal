"use strict";

/*
 * CURRÍCULO — VERSÃO 4 | Material de apoio para aula
 * HTML: conteúdo e semântica; CSS: apresentação; JavaScript: comportamento.
 *
 * Organização: uma função de inicialização para cada recurso (01 a 10).
 * As variáveis ficam dentro da função que as utiliza, reduzindo dependências.
 * Cada função segue: selecionar elementos → definir comportamento → ouvir eventos.
 * O script usa defer no HTML: o DOM já existe quando a inicialização é executada.
 * Não há bibliotecas, etapa de compilação ou servidor de envio de mensagens.
 * PERSONALIZE: para ampliar uma interação, altere a função correspondente.
 * Para criar outra, declare inicializarNovoRecurso e chame-a no ponto de entrada.
 * DOM é a representação do HTML que o JavaScript consulta e modifica.
 */

// 01. Fecha o menu mobile após a escolha de um link ou clique fora dele.
function inicializarMenuMobile() {
  // Conceitos: seleção do DOM, eventos e foco. O elemento details já abre e fecha
  // sem JavaScript; aqui acrescentamos formas convenientes de fechá-lo.

  const menuMobile = document.querySelector(".menu-mobile");

  if (menuMobile) {
    const botaoMenu = menuMobile.querySelector(".menu-mobile-botao");

    menuMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuMobile.removeAttribute("open");
        const destino = document.querySelector(link.getAttribute("href"));
        if (destino) {
          destino.setAttribute("tabindex", "-1");
          destino.focus({ preventScroll: true });
        }
      });
    });

    document.addEventListener("click", (evento) => {
      if (!menuMobile.contains(evento.target)) {
        menuMobile.removeAttribute("open");
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && menuMobile.open) {
        menuMobile.removeAttribute("open");
        botaoMenu.focus();
      }
    });
  }
}

// 02. Destaca no cabeçalho o link da seção visível.
function inicializarNavegacaoAtiva() {
  // Conceitos: NodeList, arrays, Set e observação de interseção. Set elimina
  // seções duplicadas, pois os menus desktop e mobile apontam para os mesmos IDs.

  if (!("IntersectionObserver" in window)) return;

  const linksNavegacao = document.querySelectorAll(
    '.menu-principal a[href^="#"], .menu-mobile-lista a[href^="#"], .cabecalho-contato[href^="#"]',
  );

  const secoesObservadas = [
    ...new Set(
      [...linksNavegacao]
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean),
    ),
  ];

  function destacarSecao(idSecao) {
    linksNavegacao.forEach((link) => {
      const linkAtivo = link.getAttribute("href") === `#${idSecao}`;

      if (linkAtivo) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // Guardamos o estado de todas as seções: cada callback contém apenas as
  // entradas que mudaram, e não uma lista completa das seções visíveis.
  const secoesVisiveis = new Set();

  // rootMargin reduz a área observada a uma faixa central da janela.
  const observadorSecoes = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          secoesVisiveis.add(entrada.target.id);
        } else {
          secoesVisiveis.delete(entrada.target.id);
        }
      });

      const secaoVisivel = secoesObservadas.find((secao) =>
        secoesVisiveis.has(secao.id),
      );
      // Sem seção na faixa de leitura, removemos a marcação anterior.
      destacarSecao(secaoVisivel?.id);
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 },
  );

  secoesObservadas.forEach((secao) => observadorSecoes.observe(secao));
}

// 03. Mostra o atalho de retorno depois de metade da altura da tela.
function inicializarVoltarAoTopo() {
  // Conceitos: evento scroll e classe de estado. O CSS controla a aparência;
  // o JavaScript apenas decide quando o botão deve estar visível.

  const voltarTopo = document.querySelector(".voltar-topo");

  function atualizarVoltarTopo() {
    const deveExibir = window.scrollY > window.innerHeight / 2;
    voltarTopo?.classList.toggle("voltar-topo--visivel", deveExibir);
  }

  // passive informa que o evento não vai cancelar a rolagem.
  window.addEventListener("resize", atualizarVoltarTopo);
  window.addEventListener("scroll", atualizarVoltarTopo, { passive: true });
  atualizarVoltarTopo();
}

// 04. Mantém o ano do rodapé atualizado.
function atualizarAnoRodape() {
  // Conceitos: objeto Date e textContent. Este exemplo simples é um bom
  // ponto de partida antes de estudar eventos e funções de retorno.

  const anoRodape = document.querySelector("[data-ano]");

  if (anoRodape) {
    anoRodape.textContent = new Date().getFullYear();
  }
}

// 05. Demonstração de formulário: valida dados e prepara um rascunho de e-mail.
function inicializarFormulario() {
  const formulario = document.querySelector("#form-contato");
  if (!formulario) return;

  const campos = [...formulario.querySelectorAll("input, select, textarea")];
  const feedback = document.querySelector("#feedback-formulario");
  const abrirRascunho = document.querySelector("#abrir-rascunho");
  const botaoPreparar = formulario.querySelector('[type="submit"]');

  // A validação continua usando validity do navegador, mas apresenta mensagens
  // em português junto aos campos. Sem JS, o botão permanece desabilitado.
  formulario.noValidate = true;
  botaoPreparar.disabled = false;

  function validarCampo(campo) {
    let mensagemErro = "";
    const valor = campo.value.trim();

    if (!valor) {
      mensagemErro = campo.tagName === "SELECT"
        ? "Selecione um assunto."
        : "Preencha este campo; somente espaços não são aceitos.";
    } else if (campo.type === "email" && campo.validity.typeMismatch) {
      mensagemErro = "Informe um e-mail válido, como nome@exemplo.com.";
    } else if (campo.maxLength > 0 && campo.value.length > campo.maxLength) {
      mensagemErro = `Use no máximo ${campo.maxLength} caracteres.`;
    } else if (!campo.validity.valid) {
      mensagemErro = "Confira o valor informado neste campo.";
    }

    const erro = document.querySelector(`#erro-${campo.id}`);
    erro.textContent = mensagemErro;
    erro.hidden = mensagemErro === "";
    campo.setAttribute("aria-invalid", String(mensagemErro !== ""));
    return mensagemErro === "";
  }

  campos.forEach((campo) => {
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
      // Não deixa disponível um rascunho antigo após o usuário editar os dados.
      abrirRascunho.hidden = true;
      abrirRascunho.removeAttribute("href");
      feedback.hidden = true;
      if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    abrirRascunho.hidden = true;
    abrirRascunho.removeAttribute("href");
    const camposInvalidos = campos.filter((campo) => !validarCampo(campo));
    feedback.hidden = false;

    if (camposInvalidos.length > 0) {
      feedback.dataset.tipo = "erro";
      feedback.textContent = "Revise os campos indicados. Nenhuma mensagem foi enviada.";
      camposInvalidos[0].focus();
      return;
    }

    // name no HTML é a chave de FormData. trim remove espaços das extremidades
    // dos dados utilizados no rascunho, preservando o texto visível no formulário.
    const dados = new FormData(formulario);
    const nome = dados.get("nome").trim();
    const email = dados.get("email").trim();
    const assunto = dados.get("assunto").trim();
    const mensagem = dados.get("mensagem").trim();
    const titulo = `Contato pelo portfólio — ${assunto}`;
    const corpo = [`Nome: ${nome}`, `E-mail: ${email}`, "", mensagem].join("\n");

    // PERSONALIZE: o destinatário vem do action no HTML. Para envio real pelo
    // site, implemente um serviço e validação no servidor; não exponha segredos aqui.
    abrirRascunho.href = `${formulario.action}?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(corpo)}`;
    abrirRascunho.hidden = false;
    feedback.dataset.tipo = "orientacao";
    feedback.textContent = "Rascunho preparado. Nada foi enviado. Use o link para abrir seu aplicativo de e-mail e concluir o envio por lá.";
  });
}

// 06. Barra de progresso: converte a posição de rolagem em uma proporção.
function inicializarProgresso() {
  // Conceitos: medidas do documento e proporção entre 0 e 1. A área rolável
  // exclui a altura da janela; tratamos divisão por zero em páginas curtas.

  const barraProgresso = document.querySelector("#progresso-leitura");
  if (!barraProgresso) return;

  function atualizarProgresso() {
    const altura = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = altura > 0 ? Math.min(1, Math.max(0, window.scrollY / altura)) : 0;
    barraProgresso.style.transform = `scaleX(${progresso})`;
  }
  window.addEventListener("scroll", atualizarProgresso, { passive: true });
  window.addEventListener("resize", atualizarProgresso);
  window.addEventListener("load", atualizarProgresso);
  atualizarProgresso();

  // A busca muda a altura da página; o observador mantém a barra sincronizada.
  if ("ResizeObserver" in window) {
    const observadorTamanho = new ResizeObserver(atualizarProgresso);
    observadorTamanho.observe(document.body);
  }
}

// 07. Busca instantânea: ignora maiúsculas e acentos, informa resultados vazios.
function inicializarBusca() {
  // Conceitos: input, normalização de texto, arrays e atributo hidden.
  // Os textos são coletados uma vez, antes de o modal acrescentar botões.

  const buscaProjeto = document.querySelector("#busca-projeto");
  const resultadoBusca = document.querySelector("#resultado-busca");
  if (!buscaProjeto || !resultadoBusca) return;

  const projetos = [...document.querySelectorAll(".portfolio-lista > li")];
  // NFD separa letras e acentos; a expressão regular remove os sinais.
  function normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }
  const textosProjetos = projetos.map((projeto) => normalizar(projeto.textContent));
  function filtrarProjetos() {
    const termo = normalizar(buscaProjeto.value);
    let quantidade = 0;
    projetos.forEach((projeto, indice) => {
      projeto.hidden = !textosProjetos[indice].includes(termo);
      if (!projeto.hidden) quantidade++;
    });
    resultadoBusca.textContent = quantidade
      ? `${quantidade} de ${projetos.length} projetos encontrados.`
      : "Nenhum projeto encontrado. Tente outro termo.";
  }
  buscaProjeto.addEventListener("input", filtrarProjetos);
  filtrarProjetos();
}

// 08. Modal nativo: reutiliza o conteúdo real do cartão e devolve o foco ao fechar.
function inicializarModal() {
  // Conceitos: criação de elementos, closures e dialog. O modal reutiliza os
  // dados do cartão, evitando manter duas cópias do conteúdo no HTML.

  const modalProjeto = document.querySelector("#detalhes-projeto");
  const projetos = document.querySelectorAll(".portfolio-lista > li");
  const tituloModal = document.querySelector("#titulo-modal");
  const textoModal = document.querySelector("#texto-modal");
  const linkModal = document.querySelector("#link-modal");
  if (!modalProjeto || !tituloModal || !textoModal || !linkModal) return;
  if (typeof modalProjeto.showModal !== "function") return;

  let origemModal;
  projetos.forEach((projeto) => {
    const cartao = projeto.querySelector("article");
    const tituloCartao = cartao?.querySelector("h4");
    const descricaoCartao = cartao?.querySelector("p");
    const linkCartao = cartao?.querySelector("a");
    // Se um cartão ainda estiver incompleto durante a aula, os outros funcionam.
    if (!tituloCartao || !descricaoCartao || !linkCartao) return;
    const titulo = tituloCartao.textContent;
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao detalhes-botao";
    botao.textContent = "Ver detalhes";
    botao.setAttribute("aria-label", `Ver detalhes: ${titulo}`);
    botao.setAttribute("aria-haspopup", "dialog");
    botao.setAttribute("aria-controls", "detalhes-projeto");
    botao.addEventListener("click", () => {
      origemModal = botao;
      // textContent insere texto sem interpretá-lo como marcação HTML.
      tituloModal.textContent = titulo;
      textoModal.textContent = descricaoCartao.textContent.trim();
      linkModal.href = linkCartao.href;
      modalProjeto.showModal();
    });
    cartao.append(botao);
  });
  modalProjeto.addEventListener("close", () => origemModal?.focus());
}

// 09. Contador de caracteres sincronizado com o limite nativo do textarea.
function inicializarContador() {
  // Conceitos: evento input e template literals. maxLength vem do HTML,
  // evitando repetir no JavaScript o limite definido para o campo.

  const campoMensagem = document.querySelector("#mensagem");
  const contador = document.querySelector("#contador-mensagem");
  if (!campoMensagem || !contador) return;

  function atualizarContador() {
    contador.textContent =
      `${campoMensagem.value.length} / ${campoMensagem.maxLength} caracteres`;
  }
  campoMensagem.addEventListener("input", atualizarContador);
  atualizarContador();
}

// 10. Clipboard API: só confirma a cópia após sucesso e oferece alternativa em caso de erro.
function inicializarCopiaEmail() {
  // Conceitos: async/await e try/catch. A API de cópia é assíncrona e pode
  // ser recusada pelo navegador; só mostramos sucesso após sua conclusão.

  const botaoCopiar = document.querySelector("#copiar-email");
  const linkEmail = document.querySelector('.canais-contato a[href^="mailto:"]');
  const feedback = document.querySelector("#feedback-copia");
  if (!botaoCopiar || !linkEmail || !feedback) return;

  botaoCopiar.addEventListener("click", async () => {
    const email = linkEmail.getAttribute("href").replace("mailto:", "");
    try {
      await navigator.clipboard.writeText(email);
      feedback.textContent = "E-mail copiado!";
    } catch {
      feedback.textContent = `A cópia automática não está disponível. Selecione e copie: ${email}`;
    }
  });
}

// PONTO DE ENTRADA: as funções acima descrevem os recursos; aqui os ativamos.
// A classe js permite ao CSS exibir controles que dependem de JavaScript.
document.documentElement.classList.add("js");

inicializarMenuMobile();
inicializarNavegacaoAtiva();
inicializarVoltarAoTopo();
atualizarAnoRodape();
inicializarFormulario();
inicializarProgresso();
inicializarBusca();
inicializarModal();
inicializarContador();
inicializarCopiaEmail();
