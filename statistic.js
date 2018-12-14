/*
    ** Introdução **
    Ciência que usa de teorias em experimentos e observações
    Descritiva: Organizar, demonstrar e resumir dados
    Probabilidade: Analisar situações sujeitas ao acaso
    Inferência: Obter respostas sobre um fenômeno

    Observação: Pesquisa
    Experimentos: Impor condições ou tratamento a grupos

    Variáveis:
        Quantitativa - Numéricas
            Contínuas: Valores reais
            Discretas: Números inteiros

        Qualitativa - Categóricas
            Nominais: Sem hierarquia
            Ordinais: Com hierarquia
    
    ** Amostragem **
    População: Alvo de estudo
    Amostra: Subconjunto da população
        - Possui Margem de erro, nível de confiança e variação
    Censo: Pesquisa com toda a população

    Principais tipos:
    - Aleatória simples: Determinado nr de elementos retirados da população
    de forma aleatória, tendo as mesmas chances de serem selecionados
        - Com reposição
        - Sem reposição
    - Estratificada: População dividida em estratos
    - Sistemática: Escolhido um N aleatório, e a cada N elementos um novo membro é 
    selecionado.
    - Unidade Monetária: Seleciona um número aletório entre 1 e o intervalo da 
    amostra (valor total / nr registros), ordena registros, faz cumulativo dos
    valores e seleciona os mais próximos, sendo que a cada seleção, soma o número
    aleatório com o valor selecionado e busca o mais próximo a este valor. Repete
    até o último registro.
*/

class Amostragem {
    constructor(dados, qtd, reposicao) {
        this.dados = dados;
        this.qtd = qtd;
        this.reposicao = reposicao
    }

    simples() {
        let selected = [];
        for (let i = 0; i < this.qtd; i++) {
            selected.push(this.fnSimples(this.dados, this.reposicao));
        }
        return selected;
    }
    fnSimples(dados, reposicao) {
        let elem = Math.floor(Math.random() * dados.length);
        if (!reposicao) return dados.splice(elem, 1)[0];
        return dados[elem];
    }
    estratificada(estrato, proporcional, metodo) {
        metodo = metodo || 'simples';
        let estratos = {};
        this.dados.forEach(dado => {
            if (!estratos[dado[estrato]]) estratos[dado[estrato]] = []
            estratos[dado[estrato]].push(dado)
        });
        let selected = [];
        let j = Object.keys(estratos);
        for (let i = 0; i < this.qtd; i++) {
            selected.push(this['fnSimples' || ('fn' + metodo)](estratos[j.shift()], this.reposicao));
        }
        return selected;
    }
    sistematica() {
        let elem = Math.floor(Math.random() * this.dados.length);
        let n = elem;
        let selected = [];
        for (let i = 0; i < this.qtd; i++) {
            selected.push(this.dados[elem]);
            elem += n;
            if (elem >= this.dados.length)
                elem -= this.dados.length;
        }
        return selected;
    }
    unidadeMonetaria(coluna) {
        let total = this.dados.reduce((a, b) => a + b.debito, 0);
        let intervalo = total / this.dados.length;
        let select = [];
        this.dados[0].cumulativo = this.dados[0][coluna];
        for (let i = 1; i < this.dados.length; i++) {
            this.dados[i].cumulativo = this.dados[i].debito;
            this.dados[i].cumulativo += this.dados[i - 1].cumulativo;
            if (this.dados[i].cumulativo >= intervalo) {
                select.push(this.dados[i]);
                intervalo += this.dados[i].cumulativo;
            }
        }
        return select;
    }
}

// Exemplos:
// let amostra = new Amostragem([1,5,3,5,7,4], 2, false).simples();
// let amostra = new Amostragem([
//     { idade: 10, id: 1 },
//     { idade: 10, id: 2 },
//     { idade: 10, id: 3 },
//     { idade: 10, id: 4 },
//     { idade: 20, id: 6 },
//     { idade: 20, id: 7 },
//     { idade: 20, id: 8 },
//     { idade: 20, id: 9 }
// ], 2, false).estratificada('idade');
// let amostra = new Amostragem([1,5,3,5,7,4], 2, false).sistematica();
// let amostra = new Amostragem([
//     { debito: 10, id: 1 },
//     { debito: 15, id: 2 },
//     { debito: 18, id: 3 },
//     { debito: 30, id: 4 },
//     { debito: 25, id: 6 },
//     { debito: 28, id: 7 },
//     { debito: 22, id: 8 },
//     { debito: 20, id: 9 }
// ], 2, false).unidadeMonetaria('debito');
// console.log(amostra)

/*
    Medidas de centralidade:
    Média: somatorio(x) / N
    Moda: Valor que mais se repete
    Mediana: Valor do meio - Odena valores em ordem crescente
        - Se qtd = par, mediana = media(dados[n/2], dados[n/2 + 1])
        - Se qtd = impar, mediana = dados[(n+1)/2]
*/

class Centralidade {
    constructor(dados) {
        this.dados = dados;
    }
    media(dados) {
        this.dados = dados || this.dados;
        let somatorio = this.dados.reduce((a, b) => a + b, 0);
        return somatorio / this.dados.length;
    }
    mediana(dados) {
        this.dados = dados || this.dados;
        this.dados = this.dados.sort((a, b) => a - b)
        let length = this.dados.length;
        if (length % 2 == 0)
            return this.media([this.dados[Math.floor(length / 2)], this.dados[Math.floor(length / 2 + 1)]])
        else
            return this.dados[Math.floor((length + 1) / 2) - 1]
    }
    moda(dados) {
        this.dados = dados || this.dados;
        let count = {};
        this.dados.forEach(dado => count[dado] = (count[dado] ? count[dado] + 1 : 1))
        let maior = 0;
        let valueMaior = 0;
        Object.keys(count).forEach((c, index) => {
            if (count[c] > valueMaior) {
                maior = index;
                valueMaior = count[c];
            }
        })
        return this.dados[maior];
    }
}
// Exemplos
// console.log(new Centralidade([10, 20, 40, 30, 30, 10000]).media())
// console.log(new Centralidade([10, 20, 40, 30, 30, 10000]).mediana())
// console.log(new Centralidade([10, 20, 40, 30, 30, 10000]).moda())

/*
    ** Variabilidade **
    - Variância: 
        - Amostra: (somatório(xi - media(x)) ^ 2) / n-1
        - População: (somatório(xi - media(x)) ^ 2) / n
    - Desvio Padrão: raizQuadrada(variância)
    - Amplitude: maior - menor
*/

class Variabilidade {

    constructor(dados, populacao) {
        this.dados = dados
        this.populacao = populacao;
    }

    variancia() {
        let media = new Centralidade(this.dados).media();
        let somatorio = 0;
        this.dados.forEach(dado => {
            somatorio += Math.pow(dado - media, 2);
        })
        return somatorio / (this.populacao ? this.dados.length : this.dados.length - 1);
    }
    desvioPadrao() {
        return Math.sqrt(this.variancia());
    }
    amplitude() {
        this.dados = this.dados.sort((a, b) => a - b);
        return this.dados[this.dados.length - 1] - this.dados[0];
    }

}

// Exemplos:
// let variabilidade = new Variabilidade([40.000,18.000,12.000,250.000,30.000,140.000,300.000,40.000,800.000]);
// console.log(variabilidade.variancia());
// console.log(variabilidade.desvioPadrao());
// console.log(variabilidade.amplitude());

/*
    ** Probabilidade (P): 0 <= P <= 1
        - P = 1: Evento certo
        - P = 0: Evento impossível
        - Prob. 50%: 0.5 ou 1/2
        - Impossível: -.0.5 ou -20% ou 2/1
    - Experimento: O que está sendo estudado - jogar moeda
    - Espaço amostral: Todas possíbilidades de ocorrências do evento - cara ou coroa
    - Evento: resultados ocorridos - coroa

    - Eventos Excludentes: Não podem ocorrer ao mesmo tempo - jogar um dado e ser 1 e par
    - Eventos Não Excludentes: Quando podem ocorrer ao mesmo tempo - jogar um dado e ser 2 e par
    - Eventos Dependentes: A ocorrência de um evento afeta o outro. Um ocorre depois do outro ocorrer
    - Eventos Independentes: A ocorrência de um evento não afeta o outro

    - P = Ocorrência Esperada / Número de Eventos Possíveis
        - Exemplos
            - Jogar moeda e dar cara: P = 1/2 ou 0.5 ou 50%
            - Jogar dado e dar 6: P = 1/6 ou 0.16 ou 16%
            - Jogar dado e dar 1 OU 6: P = 2/6, P=0.33
            - Jogar dado e dar 1,2,3,4,5 ou 6: P = 6/6 ou 1 ou 100%
            - Jogar dado e dar ímpar ou maior que 4 {ímpar: (1,3,5); n > 4: (5,6)} = (1,3,5,6): P = 4/6 ou 0.66 ou 66%
        
        - Eventos Excludentes: Soma das probabilidades
            - Jogar dado e ser 1 ou par: 1/6 + 3/6 = 4/6
        - Eventos Não Excludentes:
            - Jogar um dado e ser 2 ou par: 1/6 + 3/6 - 1/6 = 3/6
        - Eventos Independentes: Multiplica as probabilidades
            - Jogar dois dados, e dar 1 e 6: 1/6 * 1/6 = 1/36
        - Eventos Dependentes: 
            - Dada 6 cartas (A,2,3,4,5,6), qual a probabilidade de no primeiro evento tirar A e no segundo 4 (Não há reposição, então no primeiro evento n = 6 e no segundo n = 5)
                1/6 * 1/5 = 1/30
        -
 */


class Probabilidade {
    constructor(ocorrenciaEsperada, eventosPossiveis) {
        this.ocorrenciaEsperada = ocorrenciaEsperada;
        this.eventosPossiveis = eventosPossiveis;
    }
    excludente() {
        return this.ocorrenciaEsperada.reduce((a, b) => a + b, 0) / this.eventosPossiveis;
    }
    naoExcludente() {
        return (this.ocorrenciaEsperada.reduce((a, b) => a + b, 0) - this.ocorrenciaEsperada[0]) / this.eventosPossiveis;
    }
    dependente() {
        let aux = 0;
        return this.ocorrenciaEsperada.reduce((a, b) => {
            let result = a * b / (this.eventosPossiveis - aux);
            aux = a;
            return result;
        }, 1);
    }
    independente() {
        return this.ocorrenciaEsperada.reduce((a, b) => a * b / this.eventosPossiveis, 1);
    }
}


// console.log(new Probabilidade([1, 3], 6).excludente())
// console.log(new Probabilidade([1, 3], 6).naoExcludente())
// console.log(new Probabilidade([1, 1], 6).independente())
// console.log(new Probabilidade([1, 1], 6).dependente())

/*
    ** Distribuição **
    - Verificar comportamento de dados aleatórios

    - Distribuição Binomial
        - Distribuição de Probabilidade Discreta
        - Pré-requisitos:
            - Número fixo de experimentos
            - Cada experimento pode ter sucesso ou fracasso como resultado
            - A probabilidade de sucesso deve ser a mesma em cada experimento
            - Os experimentos são independentes
        - Convenções:
            - X: Total de sucesso esperado do experimento
            - p: Probabilidade de sucesso
            - n: número de experimentos
            - 1-p: Probabilidade de fracasso

        Fórmula: Fatorial(n x) * p ^ x * (1-p) ^ (n-x)
        Ex: Se jogar moeda 5 vezes. Qual probabilidade de dar cara 3 vezes:
            - X = 3; p = 0.5; n = 5

    - Distribuição Normal
        - Teorema Central do Limite: Conforme o tamanho da amostra aumenta,
            a distribuição das médias amostrais se aproximam cada vez mais da 
            distribuição normal
        - Independente de como os dados estão distribuídos, suas médias estão
            normalmente distribuídas
        - Distribuição Normal Padrão (Z)
            - Mostra o número de desvios padrões que o valor está acima ou
                abaixo da média (score z ou valor z)
            - Média Zero
            - Desvio Padrão 1
            - Usa-se a fórmula para calcular a probabilidade dos dados em relação
                a tabela Z. Z = (amostra - média) / desvioPadrão
*/

class DistribuicaoBinomial {
    // sucessoEsperado, probabilidadeSucesso, nrExperimentos
    constructor(x, p, n) {
        this.x = x;
        this.p = p;
        this.n = n;
    }
    calcula() {
        let fatorial = this.fatorial(this.n)
            / (this.fatorial(this.x) * this.fatorial(this.n - this.x));
        return fatorial * Math.pow(this.p, this.x) * Math.pow(1 - this.p, this.n - this.x)
    }
    cumulativa() {
        let soma = 0;
        while (this.x >= 0) {
            soma += this.calcula();
            this.x--;
        }
        return soma;
    }
    fatorial(n) {
        if (n <= 0) return 1;
        return n * this.fatorial(n - 1);
    }
}
// console.log(new DistribuicaoBinomial(3, 0.5, 5).calcula())
// console.log(new DistribuicaoBinomial(0, 0.25, 4).calcula())
// console.log(new DistribuicaoBinomial(1, 0.25, 4).calcula())
// console.log(new DistribuicaoBinomial(2, 0.25, 4).calcula())
// console.log(new DistribuicaoBinomial(3, 0.25, 4).calcula())
// console.log(new DistribuicaoBinomial(4, 0.25, 4).calcula())
// console.log(new DistribuicaoBinomial(4, 0.25, 4, true).cumulativa())


class DistribuicaoNormal {
    // sucessoEsperado, média, desvioPadrão
    constructor(x, u, o, lowerTail) {
        this.x = x;
        this.u = u;
        this.o = o;
        this.lowerTail = lowerTail;
    }
    z() {
        let z = (this.x - this.u) / this.o;
        return z;
    }

    calcula() {
        let value = new Z().normalcdf(this.z());
        return this.lowerTail ? 1 - value : value;
    };
}

class Z {
    normalcdf(X) {
        var T = 1 / (1 + .2316419 * Math.abs(X));
        var D = .3989423 * Math.exp(-X * X / 2);
        var Prob = D * T * (.3193815 + T * (-.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
        if (X > 0) {
            Prob = 1 - Prob
        }
        return Prob
    }
}

// console.log(new Z().normalcdf(1))
// Probabilidade de obj < 6, em distribuição com média = 8 e desvio padrão = 2
// console.log(new DistribuicaoNormal(6, 8, 2).calcula())
// Probabilidade de 8 < obj < 10, em distribuição com média = 8 e desvio padrão = 2
// console.log(new DistribuicaoNormal(10, 8, 2).calcula()
//     - new DistribuicaoNormal(8, 8, 2).calcula())
// Probabilidade de obj < 6 ou obj > 10, em distribuição com média = 8 e desvio padrão = 2
// console.log(new DistribuicaoNormal(6, 8, 2).calcula()
//     + new DistribuicaoNormal(10, 8, 2, true).calcula())

/*
    ** Saber se distribuição é normal **
    - Histogramas
    - Diagrama de Probabilidade Normal Q-Q Plot
    - Teste de Shapiro-Wilk
        - Teste de Hipótese
        - H0: Dados estão normalmente distribuídos
        - Alfa = 0.05
        - p-value <= 0.05: Rejeita hipótese nula
        - p-value > 0.05: Não é possível rejeitar a hipótese nula
*/

/*
    - Estatística Paramétrica: Requer dados em conformidade com alguma distribuição
        Ex: Dist. Normal
        Oferece menos riscos, tendendo a ser mais preciso que o não paramétrico
    - Estatística Não Paramétrica: Quando dados não estão em conformidade com
        alguma distribuição, ou não se conhece a distribuição
*/

/*
    ** Intervalos de Confiança **
        - Inferir características da população a partir de amostra, para reduzir custo
            e aumentar viabilidade
        - Preço: erro padrão e nível de confiança
        - Riscos: Dados ruins e enviesamento
    - Intervalo de confiança: Parâmetro mais ou menos à margem de erro estimada
    - Parâmetro: Valor a ser estimado
    - Margem de erro: Variabilidade, para mais ou menos
    - Nível de confiança: de 80 a 99%
    - Z*: 80 - 1,28; 90: 1,64; 95: 1,96; 98: 2,33; 99: 2,58;
    - Tamanho da Amostra (n)
    Ex: Entre 63 e 67% dos entrevistados pretendem votar em A, com nível de confiança
    de 95%
        Parâmetro: Intenção de Voto (Proporção)
        Nível de confiança: 95%
        Intervalo de confiança: Entre 63 e 67%
        Erro padrão: 1,96
        (n) Entrevistados: 1000
        Margem de Erro: +-2%;
    - Quanto maior nível de confiança, maior erro padrão
    - Quanto maior amostra, menor erro padrão

    - Intervalo de confiança para a média:
        - X +- Z * (Desvio Padrão / Raís quadrada de N)
    - Intervalo de confiança para a proporção:
        - p +- Z * RaizQuadrada(p(1-p)/n)
*/

class IntervaloConfianca {
    constructor(n, intervaloConfianca) {
        this.n = n;
        this.intervaloConfianca = intervaloConfianca;
        switch (intervaloConfianca) {
            case 80: this.z = 1.28; break;
            case 90: this.z = 1.64; break;
            case 95: this.z = 1.96; break;
            case 98: this.z = 2.33; break;
            case 99: this.z = 2.58; break;
        }
    }
    // Para mais e para menos (+-)
    margemErroMedia(desvioPadrao, media) {
        this.desvioPadrao = desvioPadrao;
        this.media = media;
        return this.z * (this.desvioPadrao / Math.sqrt(this.n));
    }
    margemErroProporcao(proporcoes, indexProporcao) {
        this.proporcoes = proporcoes;
        this.proporcao = proporcoes[indexProporcao] / this.n;
        return this.z * Math.sqrt((this.proporcao * (1 - this.proporcao)) / this.n)
    }
}

// Descobrir salário médio; 100 pesquisados, int conf: 95%, desv pad: 1100.00,
// média: 5.800,00, z* = 1,96
// console.log(new IntervaloConfianca(100, 95).margemErroMedia(1100, 5800));
// Proporção de eleitores em votar em A: 1000 pesquisados, int conf: 95
// 650 responde A, p = 650/1000 = 0,65; 330 responde B, p = 330/1000 = 0,33
// 20 responde nenhum, p = 20/1000 = 0,02; Valor de z* = 1,96
// console.log(new IntervaloConfianca(1000, 95)
//     .margemErroProporcao([650,330,20], 0));

/*
    ** Teste de hipótese **
    - Confirmar ou negar uma premissa usando amostra
        - H0: hipótese nula, alegação a se testar
        - Presume-se que H0 é verdadeira, a menos que evidências a contrariem
        - Ha = Hipótese alternativa
    - Score Padrão: erros padrão dos dados abaixo ou acima da média
    - Versão padronizada: Estatística de teste
    - Se a estatística de teste estiver próxima a zero ou num intervalo onde deve
    estar, então não se pode rejeitar H0
    - Se estive próximo a cauda, aí pode
    - Alfa e valor-p
        - Níveis de alfa: 0,01 ou 0,05
        - valor-p >= alfa: Não Rejeita H0
        - valor-p <= alfa: Rejeita H0
    - Etapas:
        - Define tamanho da amostra
        - Coleta dados
        - Calcula média e deviso padrão
        - Define H0 e Ha
        - Define alfa
        - Padroniza dados para gerar a estatística de teste
        - Encontra valor-p na tabela Z
        - Compara com alfa
        - Verediz
    - Fórmula Estatística de Teste:
        - Média: z = (X - média) / (desvio padrão / raíz quadrada de N)
        - Proporção: z = (p - p0) / (raizQuadrada(p0 * (1 - p0) / n)
    - Erros:
        - Tipo 1: rejeita H0 quando não deveria, chance = alfa
        - Tipo 2: não rejeita H0 quando deveria, chance depende tamanho da amostra
        - Ocorrem devido ao acaso
*/

class TesteDeHipotese {
    // suposição de média ou proporção
    constructor(n, suposicao) {
        this.n = n;
        this.x = suposicao;
    }
    estatisticaTesteMedia(desvioPadrao, media) {
        this.desvioPadrao = desvioPadrao;
        this.media = media;
        this.z = (this.x - this.media) / (this.desvioPadrao / Math.sqrt(this.n));
        this.pValue = new Z().normalcdf(this.z);
        this.pValue = (this.x > this.media) ? 1 - this.pValue : this.pValue;
        return this.pValue;
    }
    estatisticaTesteProporcao(p) {
        this.p0 = p / this.n;
        this.p = this.x / this.n;
        this.z = (this.p - this.p0) / Math.sqrt((this.p0 * (1 - this.p0)) / this.n)
        this.pValue = new Z().normalcdf(this.z);
        this.pValue = (this.x > this.p) ? 1 - this.pValue : this.pValue;
        return this.pValue;
    }
}
// Em média 22 crianças são obesas; H0 = média = 22; Ha = média > 22
// console.log(new TesteDeHipotese(100, 23).estatisticaTesteMedia(4, 22))
// Em média 75% votam em A; H0 = p = 0,75; Ha = p < 0,75
// console.log(new TesteDeHipotese(100, 73).estatisticaTesteProporcao(75))

/*
    ** T de Student **
    - Utilizada quando a amostra é pequena n < 30, e não se conhece o desvio padrão
    - Possui como custo maior variabilidade
    - Tendência maior de encontrar valores nas caudas
    - Se n >= 30, se assemelha a distribuição normal
    - Grau de Liberdade: corresponde ao tamanho da amostra (n-1)

    - Pode-se usar T de Student para: calcular probabilidades, intervalos de 
    confiança e executar testes de hipótese

    - http://www.math.ucla.edu/~tom/distributions/
    - Calcula valor t, consulta a tabela de distribuição t

    - t = (X - média) / (S / raizQuadrada de n)
*/

class TStudent {
    // Média da população, desvio padrão da amostra, tamanho da amostra, graus de liberdade
    constructor(u0, s, n) {
        this.u0 = u0;
        this.s = s;
        this.n = n;
        this.t0 = n - 1;
    }
    calcula(x) {
        this.t = (x - this.u0) / (this.s / Math.sqrt(this.n));
        return this.compute(this.t, this.t0)
    }
    logGamma(Z) {
        var S = 1 + 76.18009173 / Z - 86.50532033 / (Z + 1) + 24.01409822 / (Z + 2) - 1.231739516 / (Z + 3) + .00120858003 / (Z + 4) - .00000536382 / (Z + 5);
        var LG = (Z - .5) * Math.log(Z + 4.5) - (Z + 4.5) + Math.log(S * 2.50662827465);
        return LG
    }
    compute(X, df) {
        let betacdf = 0;
        let tcdf = 0;
        let A = df / 2;
        let S = A + .5;
        let Z = df / (df + X * X);
        let BT = Math.exp(this.logGamma(S) - this.logGamma(.5) - this.logGamma(A) + A * Math.log(Z) + .5 * Math.log(1 - Z));
        if (Z < (A + 1) / (S + 2)) {
            betacdf = BT * this.betinc(Z, A, .5)
        } else {
            betacdf = 1 - BT * this.betinc(1 - Z, .5, A)
        }
        if (X < 0) {
            tcdf = betacdf / 2
        } else {
            tcdf = 1 - betacdf / 2
        }
        return Math.round(tcdf * 100000) / 100000;
    }
    betinc(X, A, B) {
        var A0 = 0;
        var B0 = 1;
        var A1 = 1;
        var B1 = 1;
        var M9 = 0;
        var A2 = 0;
        var C9;
        while (Math.abs((A1 - A2) / A1) > .00001) {
            A2 = A1;
            C9 = -(A + M9) * (A + B + M9) * X / (A + 2 * M9) / (A + 2 * M9 + 1);
            A0 = A1 + C9 * A0;
            B0 = B1 + C9 * B0;
            M9 = M9 + 1;
            C9 = M9 * (B - M9) * X / (A + 2 * M9 - 1) / (A + 2 * M9);
            A1 = A0 + C9 * A1;
            B1 = B0 + C9 * B1;
            A0 = A0 / B1;
            B0 = B0 / B1;
            A1 = A1 / B1;
            B1 = 1;
        }
        return A1 / A
    }
    // Olhar na tabela T de Student
}

// console.log(new TStudent(75, 10, 9).calcula(80))