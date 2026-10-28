const estado = {
  filme: null,
  sessao: null,
  assentos: [],
  meias: 0,
  cupom: '',
  pagamento: '',
  descontoPix: 0
};

function lerArmazenamento(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch (erro) {
    return padrao;
  }
}

function gravarArmazenamento(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    return;
  }
}

function assentosOcupados(sessaoId) {
  const vendidos = lerArmazenamento('cinelume_ocupados', {});
  return (OCUPADOS_INICIAIS[sessaoId] || []).concat(vendidos[sessaoId] || []);
}

function renderizarFilmes() {
  const area = document.getElementById('filmes');
  area.innerHTML = '';
  FILMES.forEach(function (filme) {
    const cartao = document.createElement('article');
    cartao.className = 'filme';

    const poster = document.createElement('img');
    poster.src = filme.poster;
    poster.className = 'poster';
    poster.alt = 'Pôster do filme ' + filme.titulo;
    cartao.appendChild(poster);

    const info = document.createElement('div');
    info.className = 'filme-info';

    const titulo = document.createElement('h3');
    titulo.textContent = filme.titulo;
    info.appendChild(titulo);

    const detalhes = document.createElement('p');
    detalhes.className = 'filme-detalhes';
    detalhes.textContent = filme.genero + ' · ' + filme.duracao + ' min · ' + (filme.classificacao === 'Livre' ? 'Livre' : filme.classificacao + ' anos');
    info.appendChild(detalhes);

    const sessoes = document.createElement('div');
    sessoes.className = 'sessoes';
    filme.sessoes.forEach(function (sessao) {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'sessao';
      botao.dataset.sessao = sessao.id;
      botao.dataset.preco = precoBaseSessao(sessao);
      let rotulo = sessao.hora + ' · ' + sessao.formato;
      if (sessao.tipo === 'pré-estreia') {
        rotulo += ' · Pré-estreia';
      }
      botao.textContent = rotulo;
      botao.addEventListener('click', function () {
        selecionarSessao(filme, sessao, botao);
      });
      sessoes.appendChild(botao);
    });
    info.appendChild(sessoes);

    cartao.appendChild(info);
    area.appendChild(cartao);
  });
}

function selecionarSessao(filme, sessao, botao) {
  estado.filme = filme;
  estado.sessao = sessao;
  document.querySelectorAll('.sessao').forEach(function (b) {
    b.classList.remove('ativa');
  });
  botao.classList.add('ativa');
  document.getElementById('sessaoEscolhida').textContent = filme.titulo + ' · ' + sessao.hora + ' · ' + sessao.formato + ' · Sala ' + sessao.sala;
  renderizarMapa();
  atualizarResumo();
}

function renderizarMapa() {
  const mapa = document.getElementById('mapa');
  mapa.innerHTML = '';
  if (!estado.sessao) {
    return;
  }
  const ocupados = assentosOcupados(estado.sessao.id);
  FILEIRAS.forEach(function (fileira) {
    const linha = document.createElement('div');
    linha.className = 'fileira';
    const letra = document.createElement('span');
    letra.className = 'letra';
    letra.textContent = fileira;
    linha.appendChild(letra);
    for (let numero = 1; numero <= ASSENTOS_POR_FILEIRA; numero++) {
      const codigo = fileira + numero;
      const assento = document.createElement('div');
      assento.className = 'assento';
      assento.dataset.assento = codigo;
      assento.textContent = numero;
      if (ocupados.indexOf(codigo) !== -1) {
        assento.classList.add('ocupado');
      }
      if (estado.assentos.indexOf(codigo) !== -1) {
        assento.classList.add('selecionado');
      }
      assento.addEventListener('click', function () {
        alternarAssento(codigo, assento);
      });
      linha.appendChild(assento);
    }
    mapa.appendChild(linha);
  });
}

function alternarAssento(codigo, elemento) {
  if (elemento.classList.contains('ocupado')) {
    return;
  }
  const posicao = estado.assentos.indexOf(codigo);
  if (posicao !== -1) {
    estado.assentos.splice(posicao, 1);
    elemento.classList.remove('selecionado');
  } else {
    if (estado.assentos.length > MAX_INGRESSOS) {
      mostrarMensagens(['Você pode comprar no máximo ' + MAX_INGRESSOS + ' ingressos por pedido.']);
      return;
    }
    estado.assentos.push(codigo);
    elemento.classList.add('selecionado');
  }
  atualizarResumo();
}

function renderizarBomboniere() {
  const area = document.getElementById('bomboniere');
  area.innerHTML = '';
  PRODUTOS.forEach(function (produto) {
    const linha = document.createElement('div');
    linha.className = 'produto';

    const rotulo = document.createElement('label');
    rotulo.htmlFor = 'qtd-' + produto.id;
    rotulo.innerHTML = '<strong></strong><span></span>';
    rotulo.querySelector('strong').textContent = produto.nome;
    rotulo.querySelector('span').textContent = formatarMoeda(produto.preco);
    linha.appendChild(rotulo);

    const campo = document.createElement('input');
    campo.type = 'number';
    campo.id = 'qtd-' + produto.id;
    campo.className = 'qtd-produto';
    campo.min = '0';
    campo.max = String(MAX_POR_PRODUTO);
    campo.value = '0';
    campo.dataset.preco = produto.preco;
    campo.addEventListener('input', function () {
      let quantidade = parseInt(campo.value, 10) || 0;
      if (quantidade > MAX_POR_PRODUTO) {
        quantidade = MAX_POR_PRODUTO;
        campo.value = quantidade;
      }
      atualizarResumo();
    });
    linha.appendChild(campo);

    area.appendChild(linha);
  });
}

function lerItens() {
  return Array.prototype.map.call(document.querySelectorAll('.qtd-produto'), function (campo) {
    return {
      quantidade: parseInt(campo.value, 10) || 0,
      preco: Number(campo.dataset.preco)
    };
  });
}

function calcularValores() {
  const botaoAtivo = document.querySelector('.sessao.ativa');
  const precoBase = botaoAtivo ? Number(botaoAtivo.dataset.preco) : 0;
  const quantidade = estado.assentos.length;
  const ingressos = estado.sessao ? calcularIngressos(estado.sessao, quantidade, estado.meias, precoBase) : 0;
  const itens = lerItens();
  const bomboniere = calcularBomboniere(itens);
  const taxa = calcularTaxa(quantidade, contarItens(itens));
  const cupom = calcularDescontoCupom(estado.cupom, ingressos, bomboniere);
  const parcial = ingressos + taxa + bomboniere - cupom.valor;
  const total = Math.max(parcial - estado.descontoPix, 0);
  return {
    quantidade: quantidade,
    ingressos: ingressos,
    bomboniere: bomboniere,
    taxa: taxa,
    cupom: cupom,
    parcial: parcial,
    total: total
  };
}

function adicionarLinha(lista, termo, valor) {
  const dt = document.createElement('dt');
  dt.textContent = termo;
  const dd = document.createElement('dd');
  dd.textContent = valor;
  lista.appendChild(dt);
  lista.appendChild(dd);
}

function atualizarResumo() {
  const valores = calcularValores();
  const filme = document.getElementById('resumoFilme');
  if (estado.sessao) {
    filme.textContent = estado.filme.titulo + ' · ' + estado.sessao.hora + ' · ' + estado.sessao.formato;
  } else {
    filme.textContent = 'Nenhuma sessão escolhida.';
  }

  const escolhidos = document.getElementById('assentosEscolhidos');
  escolhidos.textContent = estado.assentos.length ? 'Assentos: ' + estado.assentos.join(', ') : 'Nenhum assento selecionado.';

  const meias = Math.min(Math.max(estado.meias, 0), valores.quantidade);
  const lista = document.getElementById('resumoValores');
  lista.innerHTML = '';
  const inteiras = valores.quantidade - meias;
  adicionarLinha(lista, 'Ingressos (' + inteiras + (inteiras === 1 ? ' inteira, ' : ' inteiras, ') + meias + (meias === 1 ? ' meia)' : ' meias)'), formatarMoeda(valores.ingressos));
  adicionarLinha(lista, 'Taxa de conveniência', formatarMoeda(valores.taxa));
  adicionarLinha(lista, 'Bomboniere', 'R$ ' + valores.bomboniere);
  if (valores.cupom.valor > 0) {
    adicionarLinha(lista, 'Desconto do cupom', '- ' + formatarMoeda(valores.cupom.valor));
  }
  if (estado.descontoPix > 0) {
    adicionarLinha(lista, 'Desconto Pix', '- ' + formatarMoeda(estado.descontoPix));
  }

  document.getElementById('total').textContent = formatarMoeda(valores.total);
  atualizarParcelas(valores.total);
}

function atualizarParcelas(total) {
  const bloco = document.getElementById('blocoParcelas');
  const info = document.getElementById('infoParcelas');
  if (estado.pagamento !== 'cartao') {
    bloco.hidden = true;
    info.textContent = estado.pagamento === 'pix' ? 'Pagamento via Pix.' : '';
    return;
  }
  bloco.hidden = false;
  const seletor = document.getElementById('parcelas');
  const anterior = parseInt(seletor.value, 10) || 1;
  const maximo = calcularParcelasMaximas(total);
  seletor.innerHTML = '';
  for (let n = 1; n <= maximo; n++) {
    const opcao = document.createElement('option');
    opcao.value = n;
    opcao.textContent = n + 'x de ' + formatarMoeda(total / n) + ' sem juros';
    seletor.appendChild(opcao);
  }
  seletor.value = String(Math.min(anterior, maximo));
  info.textContent = 'Em até ' + maximo + 'x sem juros no cartão.';
}

function aplicarCupom() {
  const campo = document.getElementById('cupom');
  const valores = calcularValores();
  const resultado = calcularDescontoCupom(campo.value, valores.ingressos, valores.bomboniere);
  const mensagem = document.getElementById('msgCupom');
  if (resultado.valido && campo.value.trim() !== '') {
    estado.cupom = campo.value;
    mensagem.textContent = resultado.mensagem;
    mensagem.className = 'msg-cupom ok';
  } else {
    estado.cupom = '';
    mensagem.textContent = resultado.mensagem || 'Digite um cupom.';
    mensagem.className = 'msg-cupom erro';
  }
  atualizarResumo();
}

function trocarPagamento(evento) {
  const forma = evento.target.value;
  if (forma === 'pix') {
    const valores = calcularValores();
    estado.descontoPix += valores.parcial * 0.05;
  }
  estado.pagamento = forma;
  atualizarResumo();
}

function mostrarMensagens(lista) {
  const area = document.getElementById('mensagens');
  area.innerHTML = '';
  lista.forEach(function (texto) {
    const p = document.createElement('p');
    p.textContent = texto;
    area.appendChild(p);
  });
}

function validarPedido() {
  const erros = [];
  if (!estado.sessao) {
    erros.push('Escolha um filme e uma sessão.');
  }
  if (estado.assentos.length === 0) {
    erros.push('Selecione pelo menos um assento.');
  }
  if (!validarNome(document.getElementById('nome').value)) {
    erros.push('Informe o nome completo (mínimo de 3 letras).');
  }
  if (!validarCPF(document.getElementById('cpf').value)) {
    erros.push('Informe um CPF válido, com 11 dígitos.');
  }
  if (!validarEmail(document.getElementById('email').value)) {
    erros.push('Informe um e-mail válido.');
  }
  if (!estado.pagamento) {
    erros.push('Escolha a forma de pagamento.');
  }
  return erros;
}

function montarPedido() {
  const valores = calcularValores();
  return {
    codigo: gerarCodigoPedido(),
    filme: estado.filme.titulo,
    sessaoId: estado.sessao.id,
    sessao: estado.sessao.hora + ' · ' + estado.sessao.formato,
    assentos: estado.assentos.slice(),
    total: valores.total,
    pagamento: estado.pagamento === 'pix' ? 'Pix' : 'Cartão ' + document.getElementById('parcelas').value + 'x',
    nome: document.getElementById('nome').value,
    data: new Date().toLocaleString('pt-BR')
  };
}

function confirmarCompra() {
  const erros = validarPedido();
  if (erros.length) {
    mostrarMensagens(erros);
    return;
  }
  const pedido = montarPedido();
  mostrarMensagens(['Processando pagamento...']);
  setTimeout(function () {
    finalizarCompra(pedido);
  }, 1500);
}

function finalizarCompra(pedido) {
  const historico = lerArmazenamento('cinelume_historico', []);
  historico.unshift(pedido);
  gravarArmazenamento('cinelume_historico', historico);

  const vendidos = lerArmazenamento('cinelume_ocupados', {});
  vendidos[pedido.sessaoId] = (vendidos[pedido.sessaoId] || []).concat(pedido.assentos);
  gravarArmazenamento('cinelume_ocupados', vendidos);

  const area = document.getElementById('confirmacao');
  area.innerHTML = '<h2>Compra confirmada!</h2>' +
    '<p>Obrigado, ' + pedido.nome + '! Seu código de retirada é <strong>' + pedido.codigo + '</strong>.</p>' +
    '<p>' + pedido.filme + ' · ' + pedido.sessao + ' · Assentos ' + pedido.assentos.join(', ') + '</p>' +
    '<p>Total pago: ' + formatarMoeda(pedido.total) + ' (' + pedido.pagamento + ')</p>';
  area.hidden = false;
  mostrarMensagens([]);
  renderizarHistorico();
  limparPedido();
  area.scrollIntoView({ behavior: 'smooth' });
}

function limparPedido() {
  estado.assentos = [];
  estado.meias = 0;
  estado.cupom = '';
  estado.descontoPix = 0;
  document.getElementById('qtdMeia').value = '0';
  document.getElementById('cupom').value = '';
  document.getElementById('msgCupom').textContent = '';
  document.querySelectorAll('.qtd-produto').forEach(function (campo) {
    campo.value = '0';
  });
  renderizarMapa();
  atualizarResumo();
}

function renderizarHistorico() {
  const lista = document.getElementById('historico');
  const historico = lerArmazenamento('cinelume_historico', []);
  lista.innerHTML = '';
  if (historico.length === 0) {
    const vazio = document.createElement('li');
    vazio.className = 'vazio';
    vazio.textContent = 'Você ainda não fez nenhuma compra.';
    lista.appendChild(vazio);
    return;
  }
  historico.slice(0, 10).forEach(function (pedido) {
    const item = document.createElement('li');
    item.textContent = pedido.data + ' · ' + pedido.codigo + ' · ' + pedido.filme + ' (' + pedido.sessao + ') · ' + pedido.assentos.join(', ') + ' · ' + formatarMoeda(pedido.total);
    lista.appendChild(item);
  });
}

function iniciar() {
  renderizarFilmes();
  renderizarBomboniere();
  renderizarHistorico();
  atualizarResumo();

  document.getElementById('qtdMeia').addEventListener('input', function (evento) {
    estado.meias = parseInt(evento.target.value, 10) || 0;
    atualizarResumo();
  });
  document.getElementById('aplicarCupom').addEventListener('click', aplicarCupom);
  document.querySelectorAll('input[name="pagamento"]').forEach(function (opcao) {
    opcao.addEventListener('change', trocarPagamento);
  });
  document.getElementById('parcelas').addEventListener('change', function () {
    atualizarResumo();
  });
  document.getElementById('confirmar').addEventListener('click', confirmarCompra);
}

iniciar();
