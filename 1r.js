/*
Para cada atributo,
    Para cada valor deste atributo, faça conforme a seguir:
        conte quantas vezes cada classe aparece
        procure o classe mais frequente
        atribua esta classe a este valor de atributo
    calcule a taxa de erro destas regras
escolha as regras com a menor taxa de erro.
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
    ['adulto', 'hipermetropia', 'ksim', 'normal', 'gelatinosa'],
    ['adulto', 'hipermetropia', 'nao', 'normal', 'gelatinosa'],
];

class UmR {
    constructor(matriz) {
        this.dados = [[]];
        this.dados = matriz;
    }
    indiceDoAtributo(atributo) {
        return this.dados[0].indexOf(atributo)
    }
    qtdCampos() {
        return this.dados[0].length;
    }
    valoresDoAtributo(atributo) {
        let valores = [];
        this.dados.forEach(dado => {
            if (!valores.includes(dado[this.indiceDoAtributo(atributo)])) {
                valores.push(dado[this.indiceDoAtributo(atributo)])
            }
        });
        delete valores[0];
        return valores;
    }
    coberturaClassePorAtributo(atributo) {
        let indiceDoAtributo = this.indiceDoAtributo(atributo)
        let cobertura = {}
        this.dados.forEach((dado, index) => {
            if (index === 0) return;
            cobertura[dado[indiceDoAtributo]] = {};
            cobertura[dado[indiceDoAtributo]][this.dados[index][this.qtdCampos() - 1]] =
                cobertura[dado[indiceDoAtributo]][this.dados[index][this.qtdCampos() - 1]]
                    ? cobertura[dado[indiceDoAtributo]][this.dados[index][this.qtdCampos() - 1]] + 1
                    : 1;
            console.log(atributo, dado[indiceDoAtributo], this.dados[index][this.qtdCampos() - 1])
        })
        console.log(cobertura)
        return cobertura
    }
    maiorCoberturaClasseParaAtributo(atributo) {
        let indiceDoAtributo = this.indiceDoAtributo(atributo)
        let coberturaClassePorAtributo = this.coberturaClassePorAtributo(atributo);
    }
    regras() {
        return this.dados[0].map(atributo => {
            this.maiorCoberturaClasseParaAtributo(atributo)
            return {
                atributo: atributo,
                regras: [

                ],
                totalErros: 0
            }
        })
    }
    treina() {
        let regras = this.regras();

    }
}


let umR = new UmR(matriz);
umR.treina();