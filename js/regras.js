const TAXA_CONVENIENCIA = 2.5;
const MAX_INGRESSOS = 6;
const MAX_POR_PRODUTO = 10;

function precoBaseSessao(sessao) {
  const hora = parseInt(sessao.hora.split(':')[0], 10);
  if (hora <= 17) {
    return 24;
  }
  return 32;
}

function calcularIngressos(sessao, quantidade, quantidadeMeia, precoBase) {
  if (quantidade <= 0) {
    return 0;
  }
  let meias = Math.min(Math.max(quantidadeMeia, 0), quantidade);
  if (sessao.tipo === 'pre-estreia') {
    meias = 0;
  }
  const inteiras = quantidade - meias;
  let total = inteiras * precoBase + meias * precoBase * 0.6;
  if (sessao.formato === '3D') {
    total += 6;
  }
  return total;
}

function calcularBomboniere(itens) {
  return itens.reduce(function (soma, item) {
    return soma + item.quantidade * item.preco;
  }, 0);
}

function contarItens(itens) {
  return itens.reduce(function (soma, item) {
    return soma + item.quantidade;
  }, 0);
}

function calcularTaxa(quantidadeIngressos, quantidadeItens) {
  if (quantidadeIngressos <= 0) {
    return 0;
  }
  return (quantidadeIngressos + quantidadeItens) * TAXA_CONVENIENCIA;
}

function calcularDescontoCupom(codigo, subtotalIngressos, subtotalBomboniere) {
  const cupom = codigo.trim().toUpperCase();
  if (cupom === '') {
    return { valido: true, valor: 0, mensagem: '' };
  }
  if (cupom === 'CINE10') {
    return { valido: true, valor: (subtotalIngressos + subtotalBomboniere) * 0.1, mensagem: 'Cupom CINE10 aplicado.' };
  }
  if (cupom === 'PIPOCA5') {
    if (subtotalBomboniere >= 20) {
      return { valido: true, valor: 5, mensagem: 'Cupom PIPOCA5 aplicado.' };
    }
    return { valido: false, valor: 0, mensagem: 'O cupom PIPOCA5 exige no mínimo R$ 25,00 em bomboniere.' };
  }
  return { valido: false, valor: 0, mensagem: 'Cupom inválido.' };
}

function calcularParcelasMaximas(total) {
  if (total > 150) {
    return 6;
  }
  return 3;
}

function validarNome(nome) {
  return nome.trim().length >= 3;
}

function validarCPF(cpf) {
  const digitos = cpf.replace(/\D/g, '');
  return digitos.length >= 10 && digitos.length <= 11;
}

function validarEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
}

function formatarMoeda(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function gerarCodigoPedido() {
  return 'CL' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
}
