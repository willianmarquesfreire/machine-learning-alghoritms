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

class UmR {
    constructor(matriz) {
        this.dados = matriz;
        this.modelo = "";
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
    maiorCoberturaClasse(objCoberturaClasse) {
        let maior = { classe: '', qtd: 0, erros: 0, qtdExemplos: 0 };
        Object.keys(objCoberturaClasse).forEach(key => {
            maior.qtdExemplos += objCoberturaClasse[key];
            if (objCoberturaClasse[key] > maior.qtd) {
                maior.classe = key;
                maior.qtd = objCoberturaClasse[key]
            }
        })
        maior.erros = maior.qtdExemplos - maior.qtd;
        return maior;
    }
    ehNumero(str) {
        return /^\d+$/.test(str);
    }
    coberturaClassePorAtributo(atributo) {
        let indiceDoAtributo = this.indiceDoAtributo(atributo)

        let cabecalho = this.dados[0];
        if (this.ehNumero(this.dados[1][indiceDoAtributo])) {
            this.dados = this.dados.slice(1, this.dados.length).sort((a, b) => {
                return a[indiceDoAtributo] - b[indiceDoAtributo] + (a[this.qtdCampos() - 1] > b[this.qtdCampos() - 1] ? 1 : 0)
            });
            this.dados.unshift(cabecalho);
        }

        let cobertura = {}
        let breakpoints = []
        let qtd = {}
        this.dados.forEach((dado, index) => {
            if (index === 0) return;
            if (this.ehNumero(dado[indiceDoAtributo])) {
                breakpoints.push({
                    'valor': this.dados[index][indiceDoAtributo],
                    'classe': this.dados[index][this.qtdCampos() - 1]
                })
                qtd[dado[this.qtdCampos() - 1]] = qtd[dado[this.qtdCampos() - 1]] ? qtd[dado[this.qtdCampos() - 1]] + 1 : 1;
                if (this.dados[index + 1] && dado[indiceDoAtributo] != this.dados[index + 1][indiceDoAtributo] && dado[this.qtdCampos() - 1] != this.dados[index + 1][this.qtdCampos() - 1]) {
                    breakpoints.push({
                        'breakpoint': index,
                        'qtd': Object.assign({}, qtd)
                    })
                }
            } else {
                cobertura[dado[indiceDoAtributo]] = cobertura[dado[indiceDoAtributo]] || {};
                cobertura[dado[indiceDoAtributo]][this.dados[index][this.qtdCampos() - 1]] =
                    cobertura[dado[indiceDoAtributo]][this.dados[index][this.qtdCampos() - 1]]
                        ? cobertura[dado[indiceDoAtributo]][this.dados[index][this.qtdCampos() - 1]] + 1
                        : 1;
            }
        })
        let lastBreakPoint = 0;
        let qtdClassesPosBreakPoint = 0;
        breakpoints.forEach((breakpoint, index) => {
            if (breakpoint.breakpoint) {
                lastBreakPoint = index;
                if (qtdClassesPosBreakPoint <= 2 && lastBreakPoint > 0) {
                    breakpoints.splice(lastBreakPoint, 1)
                }
                qtdClassesPosBreakPoint = 0;
            } else {
                qtdClassesPosBreakPoint++
            }
        })
        let filterBreakpoints = breakpoints.filter(breakpoint => breakpoint.breakpoint);
        filterBreakpoints.forEach((breakpoint, index) => {
                let predominant = null;
                // cobertura[(breakpoints[breakpoint.breakpoint - 1] + breakpoints[breakpoint.breakpoint])/2] = 
                // let maiorClasse = {
                //     classe: null,
                //     qtd: 0
                // };
                // let somaClasses = 0;
                // Object.keys(breakpoint.qtd).forEach(key => {
                //     somaClasses += breakpoint.qtd[key];
                //     if (breakpoint.qtd[key] > maiorClasse.qtd) {
                //         maiorClasse.classe = key;
                //         maiorClasse.qtd = breakpoint.qtd[key];
                //     }
                // });
                // let erros = somaClasses - maiorClasse.qtd|
                cobertura['<= '+(breakpoints[breakpoint.breakpoint - 1].valor + breakpoints[breakpoint.breakpoint + 1].valor)/2] = breakpoint.qtd
                if (filterBreakpoints[index+1]) {
                    cobertura['> '+(breakpoints[breakpoint.breakpoint - 1].valor + breakpoints[breakpoint.breakpoint + 1].valor)/2] =  filterBreakpoints[index+1].qtd;
                } else {
                    let posBreakpoints = breakpoints.slice(breakpoint.breakpoint+1, breakpoints.length);
                    let classes = {}
                    posBreakpoints.forEach(posBreak => {
                        classes[posBreak.classe] = classes[posBreak.classe] ? classes[posBreak.classe] + 1 : 1;
                    })
                    cobertura['> '+(breakpoints[breakpoint.breakpoint - 1].valor + breakpoints[breakpoint.breakpoint + 1].valor)/2] = classes;
                }

            })
        return cobertura
    }
    regras() {
        let regras = this.dados[0].map((atributo, index) => {
            if (index === this.qtdCampos() - 1) return;
            let indiceDoAtributo = this.indiceDoAtributo(atributo)
            let coberturaClassePorAtributo = this.coberturaClassePorAtributo(atributo);
            console.log("---------------------------------------------------------------------", atributo, coberturaClassePorAtributo)
            let toReturn = {
                atributo: atributo,
                regras: Object.keys(coberturaClassePorAtributo)
                    .map(key => {
                        let maiorCoberturaClasse = this.maiorCoberturaClasse(coberturaClassePorAtributo[key]);
                        return {
                            regraStr: (key.includes('<=') || key.includes('>')) ? `${atributo}  ${key}` : `${atributo} == '${key}'`,
                            valor: key,
                            classe: maiorCoberturaClasse.classe,
                            erros: maiorCoberturaClasse.erros,
                            qtdExemplos: maiorCoberturaClasse.qtdExemplos,
                            mediaErrosStr: maiorCoberturaClasse.erros + '/' + maiorCoberturaClasse.qtdExemplos,
                            mediaErros: maiorCoberturaClasse.erros / maiorCoberturaClasse.qtdExemplos
                        }
                    }),
                totalErros: 0
            }

            toReturn.regras
                .forEach(regra => {
                    toReturn.totalErros += regra.erros
                })

            toReturn.mediaTotalErrosStr = toReturn.totalErros + '/' + (this.dados.length - 1);
            toReturn.mediaTotalErros = toReturn.totalErros / (this.dados.length - 1);

            return toReturn;
        }).filter(value => value);
        return regras
    }
    treina() {
        let regras = this.regras();
        let atributoComMenoresErros = regras[0]
        regras.forEach(regra => {
            if (regra.mediaTotalErros < atributoComMenoresErros.mediaTotalErros) {
                atributoComMenoresErros = regra;
            }
        });

        let modelo = "if ("
        atributoComMenoresErros.regras.forEach((regra, index) => {
            if (index > 0) modelo += " else if ("
            modelo += `this.${regra.regraStr}) {`
            modelo += `return  '${regra.classe}'`
            modelo += "}"
        })
        this.modelo = modelo;
    }
    prediz(dado) {
        let atributos = this.dados[0];
        let predicao = null;
        let ctx = function (modelo) {
            atributos.forEach((attr, index) => {
                this[attr] = dado[index]
            })
            this.result = new Function(modelo);
            predicao = this.result();
        }
        new ctx(this.modelo);
        return predicao;
    }
}


// let umR = new UmR(matriz);
// umR.treina();
// console.log(umR.prediz(['adolescente', 'hipermetropia', 'nao', 'normal', 'gelatinosa']))
// console.log(umR.prediz(['adolescente', 'hipermetropia', 'nao', 'reduzida', 'gelatinosa']))

let umR = new UmR(matriz2);
umR.treina();
// console.log(umR)