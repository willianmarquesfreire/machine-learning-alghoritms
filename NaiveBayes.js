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
                if (!this.classes.includes(dado[dado.length - 1])) {
                    this.classes.push(dado[dado.length - 1])
                }
                this.modelo[attr][dado[index]] = this.modelo[attr][dado[index]] || {}
                this.modelo[attr][dado[index]].qtd = this.modelo[attr][dado[index]].qtd || {}
                this.modelo[attr][dado[index]]['qtd'].total = this.modelo[attr][dado[index]]['qtd'].total ? this.modelo[attr][dado[index]]['qtd'].total + 1 : 1;
                this.modelo[attr][dado[index]]['qtd'][dado[dado.length - 1]] = this.modelo[attr][dado[index]]['qtd'][dado[dado.length - 1]] ? this.modelo[attr][dado[index]]['qtd'][dado[dado.length - 1]] + 1 : 1
                this.modelo[attr].qtd = this.modelo[attr].qtd || {}
                this.modelo[attr]['qtd'][dado[dado.length - 1]] = this.modelo[attr]['qtd'][dado[dado.length - 1]] ? this.modelo[attr]['qtd'][dado[dado.length - 1]] + 1 : 1;

            })

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
                probabilidadeClasse *= this.modelo[attr][iclasse][classe];
            })
            probabilidades.push({
                prob: probabilidadeClasse,
                classe: classe
            })
        })

        let normalizacoes = probabilidades.map((probabilidade, index) => {
            return {
                probabilidade: probabilidade.prob / probabilidades.map(prob => prob.prob).reduce((a,b) => a + b),
                classe: probabilidade.classe
            }
        }).sort((a,b) => b.probabilidade - a.probabilidade)

        return normalizacoes[0]
    }
}

let naiveBayes = new NaiveBayes(matriz);
naiveBayes.treina();
console.log(naiveBayes.prediz(['infantil', 'miopia', 'nao', 'reduzida']))