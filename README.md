# Missão QA — CineLume v1.0

A Rede CineLume quer lançar a venda de ingressos online na sexta-feira. Você foi contratado como **analista de testes** para responder uma pergunta: **o sistema está pronto para o lançamento?**

Sua resposta vai ser baseada em testes. Você vai planejar, executar, registrar e relatar os testes no seu próprio repositório, usando o documento de requisitos e a planilha de testes que estão aqui.

**Duração:** 4 horas · **Entrega:** link do seu repositório no GitHub

---

## 1. O que tem neste repositório

```
cinelume-qa/
├── README.md                     ← este arquivo
├── REQUISITOS.md                 ← regras de negócio RN01 a RN21, com critérios de aceitação
├── index.html                    ← o sistema que você vai testar
├── css/estilo.css
├── js/dados.js                   ← filmes, sessões, assentos ocupados e produtos
├── js/regras.js                  ← funções de cálculo e validação
├── js/app.js                     ← funcionamento da tela
├── img/                          ← pôsteres dos filmes
├── testes/testes.html            ← executor de testes automáticos
└── relatorio/
    ├── Relatorio_de_Testes_CineLume.xlsx   ← a planilha que você vai preencher
    └── evidencias/               ← seus prints
```

## 2. Antes de começar

1. Clique em **Use this template → Create a new repository**.
2. Dê o nome `cinelume-qa-seunome-sobrenome` e escolha **Private**.
3. Em **Settings → Collaborators**, adicione o usuário do professor.
4. Clone o seu repositório: `git clone <link-do-seu-repositorio>`
5. Abra a pasta no VS Code e rode o `index.html` com o **Live Server**.
6. Renomeie a planilha para `Relatorio_de_Testes_CineLume_SeuNome.xlsx` e preencha a aba **1_Identificacao**.

## 3. As missões

Faça as missões na ordem. Ao fim de cada uma, faça um commit **e** um push com a mensagem indicada.

| Missão | O que fazer | Onde registrar | Mensagem do commit |
| --- | --- | --- | --- |
| M1 — Reconhecimento | Smoke test e revisão estática do REQUISITOS.md | Abas 2 e 3 | `test: smoke test e revisao estatica` |
| M2 — Planejamento | Plano de testes e no mínimo 15 casos de teste | Abas 4 e 5 | `docs: plano e casos de teste` |
| M3 — Execução | Executar os casos, fazer um teste exploratório e registrar os bugs | Abas 5 e 6 | `test: execucao e registro de bugs` |
| M4 — Não-funcionais | Desempenho, carga, estresse, volume, segurança, recuperação e acessibilidade | Aba 7 | `test: testes nao funcionais` |
| M5 — Caixa branca e automação | Analisar `js/regras.js` e escrever testes em `testes/testes.html` | Abas 8 e 9 | `test: caixa branca e testes automaticos` |
| M6 — Correção | Corrigir pelo menos 1 bug, confirmar a correção e rodar a regressão | Aba 10 | `fix: corrige BUG-XX` |
| M7 — Relatório final | Fechar os números e dar sua recomendação de lançamento | Aba 11 | `docs: relatorio final` |

## 4. Regras do trabalho

- O **REQUISITOS.md** é a fonte da verdade. Um comportamento é bug quando contraria uma regra (RN) ou um critério de aceitação (CA).
- Todo caso de teste e todo bug **cita a RN** relacionada.
- **Não renomeie, apague ou reordene abas e colunas da planilha.** Use as listas suspensas sempre que existirem.
- Prints vão em `relatorio/evidencias/`, com o nome do ID: `BUG-03.png`, `NF-05.png`.
- Não altere o código antes da M6. Até lá, você só testa.
- Use dados fictícios. Nunca use o seu CPF ou o de outra pessoa.
- Se usar IA, registre na aba **12_Uso_de_IA**: a ferramenta, o prompt e o que você conferiu.

## 5. Como usar os testes automáticos

Abra `testes/testes.html` pelo Live Server. A página mostra uma tabela com o resultado de cada teste.

Para criar um teste, acrescente uma linha `testar(...)` logo depois dos dois exemplos:

```javascript
testar('AT01', 'Descrição do que está sendo testado', funcaoTestada(entradas), valorEsperado);
```

- O primeiro argumento é o ID, que deve ser igual ao da aba **9_Automacao**.
- `sessao('far-2100')` devolve uma sessão pelo código. Os códigos estão em `js/dados.js`.
- Um teste que **falha** porque o sistema tem um bug é um bom teste: registre o bug.

## 6. Checklist de entrega

- [ ] Repositório privado, criado pelo template, com o professor como colaborador
- [ ] Pelo menos 7 commits, com as mensagens da tabela
- [ ] Planilha renomeada, com as abas 1 a 11 preenchidas
- [ ] Pelo menos 15 casos de teste, todos executados
- [ ] Pelo menos 6 bugs registrados, com evidência
- [ ] Pelo menos 5 testes não-funcionais, com evidência
- [ ] Pelo menos 8 testes em `testes/testes.html`
- [ ] Pelo menos 1 bug corrigido, com confirmação e regressão
- [ ] Último push feito e link enviado ao professor
