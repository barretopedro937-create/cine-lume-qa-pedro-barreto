# CineLume — Documento de Requisitos v1.0

**Produto:** CineLume, sistema web de compra de ingressos de cinema
**Versão em teste:** 1.0 (candidata a lançamento)
**Cliente:** Rede CineLume de Cinemas
**Data prevista de lançamento:** sexta-feira

---

## 1. Contexto

A Rede CineLume vai lançar a venda de ingressos pela internet. O cliente escolhe o filme e a sessão, marca os assentos no mapa da sala, informa quantos ingressos são meia-entrada, pode adicionar itens da bomboniere, aplica um cupom, preenche os dados e escolhe a forma de pagamento.

A diretoria só autoriza o lançamento se a equipe de qualidade confirmar que o sistema atende às regras de negócio deste documento. Você é o analista de testes responsável por essa avaliação.

## 2. Escopo

**Dentro do escopo:** todas as funcionalidades da página `index.html` e as funções de `js/regras.js`.

**Fora do escopo:** integração real com bancos, emissão de nota fiscal, cadastro de usuários e login. O pagamento é simulado: ao confirmar, o sistema aguarda alguns segundos e registra a compra.

## 3. Glossário

| Termo | Significado |
| --- | --- |
| Sessão | Exibição de um filme em um horário, sala e formato (2D ou 3D) |
| Matinê | Sessão que começa antes das 17:00 |
| Inteira | Ingresso pelo preço cheio |
| Meia-entrada | Ingresso com 50% de desconto, para quem tem direito por lei |
| Pré-estreia | Sessão especial exibida antes da data oficial de lançamento |
| Bomboniere | Venda de pipoca, bebidas e doces |
| Taxa de conveniência | Valor cobrado pela compra online, por ingresso |
| Subtotal de ingressos | Soma dos valores dos ingressos, sem taxa e sem bomboniere |
| Subtotal da bomboniere | Soma dos itens da bomboniere |

## 4. Tabelas de referência

### 4.1 Filmes e sessões

| Filme | Classificação | Sessão | Formato | Tipo | Sala |
| --- | --- | --- | --- | --- | --- |
| Órbita Silenciosa | 12 anos | 14:00 | 2D | Regular | 1 |
| Órbita Silenciosa | 12 anos | 17:00 | 3D | Regular | 1 |
| Órbita Silenciosa | 12 anos | 20:30 | 3D | Regular | 1 |
| O Último Farol | 14 anos | 16:30 | 2D | Regular | 2 |
| O Último Farol | 14 anos | 21:00 | 2D | Regular | 2 |
| Turma do Quintal | Livre | 13:00 | 2D | Regular | 3 |
| Turma do Quintal | Livre | 15:30 | 3D | Regular | 3 |
| Cidade de Vidro | 16 anos | 22:00 | 2D | Pré-estreia | 4 |

Cada sala tem 80 assentos: fileiras de A a H, com assentos numerados de 1 a 10.

### 4.2 Preços dos ingressos

| Situação | Inteira |
| --- | --- |
| Matinê (sessão que começa antes das 17:00) | R$ 24,00 |
| Sessão que começa às 17:00 ou depois | R$ 32,00 |
| Adicional 3D (somado a cada ingresso) | + R$ 6,00 |

### 4.3 Bomboniere

| Produto | Preço |
| --- | --- |
| Pipoca pequena | R$ 14,00 |
| Pipoca grande | R$ 22,00 |
| Refrigerante 500 ml | R$ 9,50 |
| Água mineral | R$ 6,00 |
| Chocolate | R$ 7,90 |

### 4.4 Cupons

| Cupom | Benefício | Condição |
| --- | --- | --- |
| CINE10 | 10% de desconto | Só sobre o subtotal de ingressos |
| PIPOCA5 | R$ 5,00 de desconto | Subtotal da bomboniere de no mínimo R$ 25,00 |

## 5. Regras de negócio e critérios de aceitação

Cada regra tem um código (RN01 a RN21). Todo caso de teste e todo relatório de bug deve citar a regra relacionada.

### Ingressos

**RN01 — Preço por horário**
O preço da inteira depende do horário de início da sessão: R$ 24,00 para matinê (antes das 17:00) e R$ 32,00 para sessões às 17:00 ou depois.
- CA01.1: Uma sessão das 16:30 cobra R$ 24,00 por inteira.
- CA01.2: Uma sessão das 17:00 cobra R$ 32,00 por inteira (antes do adicional 3D).
- CA01.3: Uma sessão das 21:00 cobra R$ 32,00 por inteira.

**RN02 — Adicional 3D**
Sessões 3D somam R$ 6,00 a cada ingresso vendido.
- CA02.1: 1 inteira em sessão 3D das 20:30 custa R$ 38,00.
- CA02.2: 2 inteiras em sessão 3D das 20:30 custam R$ 76,00.

**RN03 — Meia-entrada**
A meia-entrada custa 50% do valor do ingresso, já incluído o adicional 3D quando houver.
- CA03.1: 1 meia em sessão 2D das 21:00 custa R$ 16,00.
- CA03.2: 1 meia em sessão 3D das 20:30 custa R$ 19,00.
- CA03.3: O número de meias não pode ser maior que o número de assentos escolhidos.

**RN04 — Pré-estreia**
Sessões de pré-estreia não aceitam meia-entrada: todos os ingressos são cobrados como inteira.
- CA04.1: Na sessão de pré-estreia, informar 1 meia não altera o preço: 1 ingresso custa R$ 32,00.

**RN05 — Quantidade de ingressos**
Cada pedido tem no mínimo 1 e no máximo 6 ingressos.
- CA05.1: Sem nenhum assento escolhido, a compra não é confirmada.
- CA05.2: É possível escolher 6 assentos.
- CA05.3: Ao tentar escolher o 7º assento, o sistema recusa e avisa o cliente.

**RN06 — Seleção de assentos**
Assentos ocupados não podem ser escolhidos. Clicar num assento escolhido desfaz a escolha. Ao trocar de sessão, a seleção anterior é descartada.
- CA06.1: Clicar num assento ocupado não faz nada.
- CA06.2: Clicar de novo num assento escolhido o libera e o retira do valor.
- CA06.3: Ao trocar de sessão, nenhum assento fica escolhido e o valor dos ingressos volta a zero.

### Bomboniere e taxa

**RN07 — Quantidade na bomboniere**
Cada produto aceita quantidade inteira de 0 a 10.
- CA07.1: Uma quantidade acima de 10 é corrigida para 10.
- CA07.2: Uma quantidade negativa não é aceita e não altera o valor do pedido.

**RN08 — Taxa de conveniência**
É cobrada uma taxa de R$ 2,50 por ingresso. A taxa não incide sobre os itens da bomboniere.
- CA08.1: 2 ingressos geram R$ 5,00 de taxa.
- CA08.2: 1 ingresso e 2 pipocas geram R$ 2,50 de taxa.

### Cupons

**RN09 — Cupom CINE10**
Dá 10% de desconto apenas sobre o subtotal de ingressos. A digitação não diferencia maiúsculas de minúsculas e espaços nas pontas são ignorados.
- CA09.1: Com 1 inteira de R$ 32,00 e uma pipoca grande, o desconto é de R$ 3,20.
- CA09.2: "cine10" e " CINE10 " são aceitos.

**RN10 — Cupom PIPOCA5**
Dá R$ 5,00 de desconto quando o subtotal da bomboniere é de no mínimo R$ 25,00.
- CA10.1: Com subtotal da bomboniere de R$ 25,00 ou mais, o desconto é aplicado.
- CA10.2: Com subtotal da bomboniere menor que R$ 25,00, o cupom é recusado com mensagem.
- CA10.3: Apenas um cupom vale por pedido. Aplicar outro substitui o anterior.
- CA10.4: Um código que não existe é recusado com a mensagem "Cupom inválido."

### Pagamento

**RN11 — Desconto Pix**
O pagamento via Pix tem 5% de desconto sobre o valor do pedido (ingressos + taxa + bomboniere − cupom). O desconto só vale enquanto Pix estiver selecionado.
- CA11.1: Um pedido de R$ 34,50 pago via Pix fica em R$ 32,78 (arredondamento de centavos aceito: R$ 32,77 ou R$ 32,78).
- CA11.2: Trocar de Pix para cartão remove o desconto.
- CA11.3: Alternar entre Pix e cartão várias vezes nunca dá mais de 5% de desconto.

**RN12 — Parcelamento no cartão**
No cartão de crédito, o pedido pode ser parcelado em até 3x sem juros. Pedidos a partir de R$ 150,00 podem ser parcelados em até 6x sem juros.
- CA12.1: Um pedido de R$ 149,99 permite no máximo 3x.
- CA12.2: Um pedido de R$ 150,00 permite até 6x.

### Dados do comprador

**RN13 — Validação dos dados**
Para confirmar a compra, o cliente informa:
- **Nome completo:** obrigatório, com no mínimo 3 caracteres.
- **CPF:** obrigatório, com exatamente 11 dígitos. Pode ser digitado com ou sem pontos e traço.
- **E-mail:** obrigatório, no formato nome@dominio.extensao.
- **Celular:** opcional.

Critérios:
- CA13.1: Nome com 2 letras é recusado; com 3 letras é aceito.
- CA13.2: CPF com 10 dígitos é recusado; com 11 é aceito; com 12 é recusado.
- CA13.3: E-mail sem @ é recusado.
- CA13.4: Qualquer dado inválido impede a confirmação e mostra uma mensagem explicando o problema.

### Confirmação e histórico

**RN14 — Confirmação da compra**
Com tudo válido, o botão "Confirmar compra" mostra "Processando pagamento..." e, em seguida, a tela de confirmação com o nome do cliente, o código de retirada, o filme, a sessão, os assentos e o total pago.
- CA14.1: A confirmação mostra todos os dados acima.
- CA14.2: Depois da confirmação, o pedido em andamento é limpo.

**RN15 — Registro único da compra**
Cada compra confirmada gera um único registro em "Minhas compras", e os assentos comprados passam a aparecer como ocupados naquela sessão.
- CA15.1: Uma compra gera exatamente um registro, mesmo que o cliente clique várias vezes em "Confirmar compra".
- CA15.2: Ao reabrir a mesma sessão, os assentos comprados aparecem ocupados.

**RN16 — Pedido em andamento**
Se a página for recarregada (F5) ou fechada por acidente antes da confirmação, o pedido em andamento (sessão, assentos, meias e bomboniere) deve continuar lá quando o cliente voltar.
- CA16.1: Depois de escolher sessão e assentos, apertar F5 mantém a sessão e os assentos escolhidos.

### Requisitos não-funcionais

**RN17 — Desempenho**
A página deve ficar utilizável em até 3 segundos em conexão "Slow 4G". Nenhuma imagem pode passar de 300 KB.
- CA17.1: No DevTools, com Disable cache e Slow 4G, o carregamento termina em até 3 s.
- CA17.2: Nenhuma imagem baixada passa de 300 KB.

**RN18 — Segurança dos dados exibidos**
Tudo o que o cliente digita é exibido como texto. Código HTML ou JavaScript digitado nunca é executado.
- CA18.1: Digitar `<b>Ana</b>` no nome exibe o texto literal, sem negrito, na confirmação.

**RN19 — Acessibilidade**
A compra inteira pode ser feita só com o teclado (Tab, Shift+Tab, setas, Enter e Espaço).
- CA19.1: É possível escolher sessão, assentos, bomboniere, dados, pagamento e confirmar sem usar o mouse.

**RN20 — Exibição de valores**
Todos os valores em dinheiro aparecem no formato brasileiro, com R$, vírgula e duas casas decimais (exemplo: R$ 23,70).
- CA20.1: Todas as linhas do resumo seguem o formato R$ 0,00.

**RN21 — Integridade dos preços**
Os preços são definidos pelo sistema. Alterar a página pelo navegador (DevTools) não muda o valor cobrado.
- CA21.1: Editar no DevTools um atributo ou texto de preço da página não altera o total do pedido.

## 6. Critério para lançamento

A versão 1.0 pode ser lançada se:
1. Nenhum bug de severidade crítica ou alta estiver aberto.
2. Pelo menos 90% dos casos de teste executados tiverem passado.
3. Os requisitos de segurança (RN18 e RN21) estiverem atendidos.
