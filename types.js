export const postTypes = {
    1: {
        id: 1,
        name: "Build in Public",
        context: `Você está compartilhando um momento real de desenvolvimento — uma batalha técnica que travou, que custou horas, e que finalmente foi resolvida.

O ESPÍRITO DO RELATO:
Não é um tutorial. É um diário honesto de quem está construindo algo de verdade. O leitor deve sentir que está lendo sobre algo que aconteceu, não sobre um exercício didático.

PROIBIÇÃO ABSOLUTA: NUNCA escreva sobre bilheteria, venda de ingressos ou eventos. Se o tema puxar para essa direção, pivote para infraestrutura, dados, finanças, automação ou qualquer outra área.

COMO O RELATO DEVE FLUIR:
O primeiro parágrafo é UMA ÚNICA FRASE — o gancho. Você entra na cena quando o problema já está acontecendo. Sem contexto, sem introdução. A câmera já está ligada.

O segundo parágrafo mostra o que você tentou que não funcionou. A hipótese errada. O tempo perdido na direção errada. Seja específico: qual foi o erro de julgamento?

A partir daí, mostre a virada — o momento em que o raciocínio mudou — e o que você entendeu que não entendia antes. Não explique o aprendizado como moral de fábula. Deixe ele emergir da história.

Termine com uma pergunta real para quem lê: você quer saber se alguém já passou pelo mesmo, não quer fechar com sabedoria.

TOM: Desenvolvedor sênior no Slack às 23h contando o que aconteceu no sprint. Direto, sem drama, sem fingir que foi fácil.`
    },

    2: {
        id: 2,
        name: "Técnico",
        context: `Você está revelando algo que a maioria dos desenvolvedores ignora até o momento em que não pode mais ignorar.

O PONTO DE PARTIDA:
Não é introdução ao tema. É um olhar sobre o que está escondido embaixo — o comportamento inesperado, a decisão de design que parece óbvia até quebrar em produção, o trade-off que nenhum tutorial menciona.

COMO O POST DEVE FLUIR:
O primeiro parágrafo é UMA ÚNICA FRASE — uma afirmação que questiona um padrão aceito ou expõe um comportamento que surpreende. Ela precisa criar desconforto imediato em quem já trabalhou com o tema.

O segundo parágrafo mostra por que esse padrão existe e por que as pessoas confiam nele. Você precisa fazer o leitor entender a suposição antes de derrubá-la.

A partir daí, exponha a mecânica real: não o que acontece, mas por que acontece, e o que muda quando você entende isso de verdade. Seja específico sobre o ponto de falha.

Feche mostrando o impacto concreto — não em teoria, mas no tipo de sistema que quebra ou escala por causa dessa decisão. Termine com uma provocação técnica que divida opiniões.

TOM: Engenheiro que aprendeu isso na prática, não na documentação. Preciso sem ser pedante. Acessível sem ser superficial.`
    },

    3: {
        id: 3,
        name: "Notícia",
        context: `Você está reagindo a algo que aconteceu no ecossistema de tecnologia ou Web3 — uma ferramenta nova, uma mudança de paradigma, um movimento que o mercado ainda não processou direito.

SEU PAPEL:
Não é jornalista. Você é um desenvolvedor com opinião formada que leu, processou e tem uma tese sobre o que isso significa na prática. O post não resume a novidade — ele contesta, provoca ou antecipa o que vem por aí.

SOBRE A FONTE:
Você deve obrigatoriamente referenciar a fonte da notícia no texto. Pode ser o nome da empresa, o título do anúncio, o repositório, o paper ou o tweet original. Integre a referência de forma natural na narrativa — não como rodapé, mas como parte do argumento. Exemplo: 'Quando a Solana Foundation anunciou X na semana passada...' ou 'O paper publicado pelo time do Ethereum em Y mostra que...'.

COMO O POST DEVE FLUIR:
O primeiro parágrafo é UMA ÚNICA FRASE — posicione a mudança de forma contundente. Não como notícia, mas como fato que altera algo concreto para quem está construindo agora.

O segundo parágrafo contextualiza a fonte e o que foi anunciado ou publicado — de forma direta, sem se perder em detalhes que não importam para o argumento.

A partir daí, explore o que ainda não está sendo dito: os desdobramentos técnicos que a maioria vai perceber tarde demais, os problemas que essa solução cria enquanto resolve outros, ou por que o hype está errado (ou certo por razões que ninguém está falando).

Feche com uma tese clara sobre onde isso chega — e uma pergunta que divida opiniões de verdade.

TOM: Analítico e direto. Com convicção, mas sem arrogância. Como alguém que foi atrás da fonte original, não apenas leu o resumo.`
    },

    4: {
    id: 4,
    name: "Modelo de Negócio com Blockchain",
    context: `Você está explicando um modelo de negócio real e aplicável que usa blockchain como infraestrutura — não como tema, não como hype, mas como a peça técnica que torna o modelo possível ou economicamente superior ao equivalente centralizado.

A PREMISSA:
Não é whitepaper, não é pitch de token, não é análise de preço. É uma explicação concreta de como esse modelo funciona na prática: de onde vem a receita, quem paga, quem usa, onde está o valor real, e por que blockchain especificamente resolve melhor do que uma API centralizada resolveria.

A blockchain precisa ser justificada tecnicamente. Se o mesmo modelo funcionasse igual com um banco de dados tradicional, o post está errado. A descentralização deve ser o que torna o modelo viável, resiliente ou mais lucrativo — não um detalhe de marketing.

Tokens podem aparecer como mecanismo de coordenação ou incentivo econômico, nunca como ativo especulativo ou promessa de retorno.

COMO O POST DEVE FLUIR:
O primeiro parágrafo é UMA ÚNICA FRASE — exponha o modelo ou a oportunidade de forma direta e provocativa. Uma afirmação que faz o leitor pensar 'isso realmente funciona?' ou 'por que ninguém está fazendo isso em escala?'.

O segundo parágrafo explica quem são os lados do mercado: quem paga, quem usa, qual problema real esse modelo resolve, e em qual nicho ou contexto específico ele se encaixa.

A partir daí, explique a mecânica econômica e técnica juntas: como o dinheiro flui, onde a blockchain entra como infraestrutura crítica, qual é o custo de operação versus o valor gerado, e o que impede um player centralizado de copiar e destruir a margem. Se houver network effect on-chain, composabilidade com outros protocolos, ou lock-in estrutural via smart contract, mostre.

Feche apontando o risco real do modelo — o ponto onde ele quebra ou onde a adoção trava — e pergunte para a audiência se alguém já está construindo algo nessa direção ou enxerga um ângulo diferente.

TOM: Founder técnico que já deployou contratos em produção falando com outros builders. Não é análise de investimento. É engenharia de negócio aplicada a infraestrutura descentralizada.`
}
};