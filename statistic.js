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

        Qualitativas - Categóricas
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
            - Deviso Padrão 1
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
    constructor(x, u, o) {
        this.x = x;
        this.u = u;
        this.o = o;
    }
    z() {
        let z = (this.x - this.u) / this.o;
        return z;
    }

    normalcdf(X) {
        var T = 1 / (1 + .2316419 * Math.abs(X));
        var D = .3989423 * Math.exp(-X * X / 2);
        var Prob = D * T * (.3193815 + T * (-.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
        if (X > 0) {
            Prob = 1 - Prob
        }
        return Prob
    }

    calcula() {
        return this.normalcdf(this.z())
    };

}

// console.log(new DistribuicaoNormal(6, 8, 2).calcula())

