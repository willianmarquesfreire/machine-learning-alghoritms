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
    ['adolescente', 'miopia', 'nao', 'reduzida', 'nenhuma'],
    ['adolescente', 'miopia', 'nao', 'normal', 'dura'],
    ['adolescente', 'hipermetropia', 'nao', 'reduzida', 'gelatinosa'],
    ['adolescente', 'hipermetropia', 'sim', 'normal', 'dura'],
    ['adulto', 'miopia', 'nao', 'normal', 'gelatinosa'],
    ['adulto', 'miopia', 'sim', 'normal', 'dura'],
    ['adulto', 'miopia', 'sim', 'normal', 'gelatinosa'],
    ['adulto', 'miopia', 'nao', 'reduzida', 'nenhuma'],
    ['adulto', 'hipermetropia', 'sim', 'normal', 'gelatinosa'],
    ['adulto', 'hipermetropia', 'nao', 'normal', 'gelatinosa'],
];

class NaiveBayes {
    constructor(dados) {
        this.dados = [[]]
        this.modelo = {}
        this.dados = dados;
        this.laplace = true;
    }
    treina(laplace) {
        this.laplace = laplace || true;
        this.dados[0].forEach((attr, index) => {
            this.modelo[attr] = {}
            this.dados.forEach((dado, i) => {
                if (i === 0) return;
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
                            console.log(attr, key, this.modelo[attr][key].qtd)
                            if (this.modelo[attr][classe] && this.modelo[attr][classe].qtd) {
                                this.modelo[attr][key]['valor_' + classe] = ((this.modelo[attr][key].qtd[classe] || 0) + (this.laplace ? 1 : 0)) /
                                    (this.laplace ? this.modelo[attr].qtd[classe] + Object.keys(this.modelo[attr][key].qtd).length - 1 : this.modelo[attr].qtd[classe])
                            } else {
                                this.modelo[attr][key][classe] = ((this.modelo[attr][key].qtd[classe] || 0) + (this.laplace ? 1 : 0)) /
                                    (this.laplace ? this.modelo[attr].qtd[classe] + Object.keys(this.modelo[attr][key].qtd).length - 1 : this.modelo[attr].qtd[classe])
                            }
                            this.modelo[attr][key]['str_' + classe] = ((this.modelo[attr][key].qtd[classe] || 0) + (this.laplace ? 1 : 0)) + ' / '
                                + (this.laplace ? this.modelo[attr].qtd[classe] + Object.keys(this.modelo[attr][key].qtd).length - 1 : this.modelo[attr].qtd[classe])
                        }
                    })
                }
            })
        })
        console.log(this.modelo)
    }
    prediz(dado) {

    }
}

let naiveBayes = new NaiveBayes(matriz);
naiveBayes.treina();
naiveBayes.prediz(['infantil', 'hipermetropia', 'nao', 'reduzida']);