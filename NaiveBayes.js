/*
Para cada atributo
    Para cada valor deste atributo, faça conforme a seguir:
        conte quantas vezes cada classe aparece
        monte a tabela de probabilidade
        aplique Laplace

Na classificação calcule para cada classe: 
    Pr[classe|E], normalize
    escolha a maior probabilidade 
*/
let matriz = [
    ['Idade', 'Diagnostico', 'Astigmatismo', 'Taxa_lacrimal', 'Lente'],
    ['infantil', 'miopia', 'nao', 'reduzida', 'nenhuma'],
    ['infantil', 'miopia', 'sim', 'normal', 'gelatinosa'],
    ['infantil', 'hipermetropia', 'nao', 'normal', 'gelatinosa'],
    ['infantil', 'hipermetropia', 'sim', 'normal', 'dura'],
    ['adolescente', 'miopia', 'nao', 'reduzida', 'gelatinosa'],
    ['adolescente', 'miopia', 'sim', 'reduzida', 'nenhuma'],
    ['adolescente', 'miopia', 'nao', 'normal', 'dura'],
    ['adolescente', 'hipermetropia', 'nao', 'reduzida', 'gelatinosa'],
    ['adolescente', 'hipermetropia', 'sim', 'normal', 'dura'],
    ['adulto', 'miopia', 'nao', 'normal', 'gelatinosa'],
    ['adulto', 'miopia', 'sim', 'normal', 'dura'],
    ['adulto', 'miopia', 'sim', 'normal', 'gelatinosa'],
    ['adulto', 'hipermetropia', 'nao', 'reduzida', 'nenhuma'],
    ['adulto', 'hipermetropia', 'sim', 'normal', 'gelatinosa'],
    ['adulto', 'hipermetropia', 'nao', 'normal', 'gelatinosa'],
];

let matriz2 = [
    ['Previsao', 'Temperatura', 'Humidade', 'Ventando', 'Jogar'],
    ['Ensolarado', 85, 85, 'falso', 'nao'],
    ['Ensolarado', 80, 90, 'verdade', 'nao'],
    ['Nublado', 83, 86, 'falso', 'sim'],
    ['Chuvoso', 70, 96, 'falso', 'sim'],
    ['Chuvoso', 68, 80, 'falso', 'sim'],
    ['Chuvoso', 65, 70, 'verdade', 'nao'],
    ['Nublado', 64, 65, 'verdade', 'sim'],
    ['Ensolarado', 72, 95, 'falso', 'nao'],
    ['Ensolarado', 69, 70, 'falso', 'sim'],
    ['Chuvoso', 75, 80, 'falso', 'sim'],
    ['Ensolarado', 75, 70, 'verdade', 'sim'],
    ['Nublado', 72, 90, 'verdade', 'sim'],
    ['Nublado', 81, 75, 'falso', 'sim'],
    ['Chovendo', 71, 91, 'verdade', 'nao'],
];

class NaiveBayes {
    constructor(dados) {
        this.dados = [[]]
        this.modelo = {}
        this.dados = dados;
        this.laplace = true;
        this.classes = [];
    }
    treina(laplace) {
        this.dados[0].forEach((attr, index) => {
            this.modelo[attr] = {}
            this.dados.forEach((dado, i) => {
                if (i === 0) return;
                if (typeof dado[index] == 'number') {
                    this.modelo[attr].numeros = this.modelo[attr].numeros || {}
                    this.modelo[attr]['numeros'][dado[dado.length - 1]] = this.modelo[attr]['numeros'][dado[dado.length - 1]] ? this.modelo[attr]['numeros'][dado[dado.length - 1]].concat(dado[index]) : [dado[index]]
                    this.modelo[attr].qtd = this.modelo[attr].qtd || {}
                    this.modelo[attr]['qtd'][dado[dado.length - 1]] = this.modelo[attr]['qtd'][dado[dado.length - 1]] ? this.modelo[attr]['qtd'][dado[dado.length - 1]] + 1 : 1;
                    this.modelo[attr].soma = this.modelo[attr].soma || {}
                    this.modelo[attr]['soma'][dado[dado.length - 1]] = this.modelo[attr]['soma'][dado[dado.length - 1]] ? this.modelo[attr]['soma'][dado[dado.length - 1]] + dado[index] : dado[index];
                    this.modelo[attr].media = this.modelo[attr].media || {}
                    this.modelo[attr]['media'][dado[dado.length - 1]] = this.modelo[attr]['soma'][dado[dado.length - 1]] / this.modelo[attr]['qtd'][dado[dado.length - 1]]
                    this.modelo[attr].desvioPadrao = this.modelo[attr].desvioPadrao || {}
                    this.modelo[attr].desvioPadrao[dado[dado.length - 1]] = 0
                } else {
                    if (!this.classes.includes(dado[dado.length - 1])) {
                        this.classes.push(dado[dado.length - 1])
                    }
                    this.modelo[attr][dado[index]] = this.modelo[attr][dado[index]] || {}
                    this.modelo[attr][dado[index]].qtd = this.modelo[attr][dado[index]].qtd || {}
                    this.modelo[attr][dado[index]]['qtd'].total = this.modelo[attr][dado[index]]['qtd'].total ? this.modelo[attr][dado[index]]['qtd'].total + 1 : 1;
                    this.modelo[attr][dado[index]]['qtd'][dado[dado.length - 1]] = this.modelo[attr][dado[index]]['qtd'][dado[dado.length - 1]] ? this.modelo[attr][dado[index]]['qtd'][dado[dado.length - 1]] + 1 : 1
                    this.modelo[attr].qtd = this.modelo[attr].qtd || {}
                    this.modelo[attr]['qtd'][dado[dado.length - 1]] = this.modelo[attr]['qtd'][dado[dado.length - 1]] ? this.modelo[attr]['qtd'][dado[dado.length - 1]] + 1 : 1;
                }
            })
            if (this.modelo[attr].numeros) {
                Object.keys(this.modelo[attr].numeros)
                    .forEach(classe => {
                        this.modelo[attr].numeros[classe].forEach(valor => {
                            this.modelo[attr].desvioPadrao[classe] += (valor - this.modelo[attr].media[classe]) * (valor - this.modelo[attr].media[classe]);
                        })
                    })
                Object.keys(this.modelo[attr].desvioPadrao)
                    .forEach(classe => {
                        this.modelo[attr].desvioPadrao[classe] = Math.sqrt(this.modelo[attr].desvioPadrao[classe] / this.modelo[attr].numeros[classe].length)
                    })
            }
            Object.keys(this.modelo[attr]).forEach(key => {
                if (key != 'qtd') {
                    Object.keys(this.modelo[attr].qtd).forEach(classe => {
                        if (this.modelo[attr][key].qtd) {
                            this.modelo[attr][key].qtd[classe] = this.modelo[attr][key].qtd[classe] || 0;
                            if (this.modelo[attr][classe] && this.modelo[attr][classe].qtd) {
                                this.modelo[attr][key][classe] = ((this.modelo[attr][key].qtd[classe] || 0) + (this.laplace ? 1 : 0)) /
                                    (this.laplace ? this.dados.length - 1 + this.classes.length : this.dados.length - 1);

                                this.modelo[attr][key]['str_' + classe] = ((this.modelo[attr][key].qtd[classe] || 0) + (this.laplace ? 1 : 0)) + ' / '
                                    + (this.laplace ? this.dados.length - 1 + this.classes.length : this.dados.length - 1);
                            } else {
                                this.modelo[attr][key][classe] = ((this.modelo[attr][key].qtd[classe] || 0) + (this.laplace ? 1 : 0)) /
                                    (this.laplace ? this.modelo[attr].qtd[classe] + Object.keys(this.modelo[attr]).length - 1 : this.modelo[attr].qtd[classe]);

                                this.modelo[attr][key]['str_' + classe] = ((this.modelo[attr][key].qtd[classe] || 0) + (this.laplace ? 1 : 0)) + ' / '
                                    + (this.laplace ? this.modelo[attr].qtd[classe] + Object.keys(this.modelo[attr]).length - 1 : this.modelo[attr].qtd[classe]);

                            }
                        }
                    })
                }
            })
        })
    }
    prediz(dado) {
        let probabilidades = [];
        this.classes.forEach(classe => {
            let probabilidadeClasse = 1;
            this.dados[0].forEach((attr, i) => {
                let iclasse = dado[i] || classe;
                if (this.modelo[attr][iclasse]) {
                    probabilidadeClasse *= this.modelo[attr][iclasse][classe];
                } else {
                    probabilidadeClasse = (1 / (Math.sqrt(2 * Math.PI) * this.modelo[attr].desvioPadrao[classe]))
                    * Math.pow(Math.E, -(Math.pow(iclasse - this.modelo[attr].media[classe], 2) / Math.pow(2 * this.modelo[attr].desvioPadrao[classe], 2)))
                }
            })
            probabilidades.push({
                prob: probabilidadeClasse,
                classe: classe
            })
        })

        let normalizacoes = probabilidades.map((probabilidade, index) => {
            return {
                probabilidade: probabilidade.prob / probabilidades.map(prob => prob.prob).reduce((a, b) => a + b),
                classe: probabilidade.classe
            }
        }).sort((a, b) => b.probabilidade - a.probabilidade)

        return normalizacoes[0]
    }
}

// let naiveBayes = new NaiveBayes(matriz);
// naiveBayes.treina();
// console.log(naiveBayes.prediz(['infantil', 'miopia', 'nao', 'reduzida']))

let naiveBayes = new NaiveBayes(matriz2);
naiveBayes.treina();
console.log(naiveBayes.prediz(['Ensolarado', 66, 90, 'verdade']))