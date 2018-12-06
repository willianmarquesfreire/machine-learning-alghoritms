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
