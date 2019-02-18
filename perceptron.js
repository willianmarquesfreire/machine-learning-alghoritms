// Perceptron: Proposto por Rosemblat 1958
// Utiliza Modelo de neurônio de McCulloch e Pitts 1943 (neurônio M-P)
/* 
    Entrada: O neurônio faz o somatório ponderados das entradas com pesos
    Saída: O resultado é aplicado a uma função de ativação (limiar), que
    determina o valor de saída (nível de ativação)

    Função degrau: se somatório > 0, então 1 ou +1 senão 0 ou -1

    Se os dados podem ser separados em dois grupos por um hiperplano, 
    são linearmente separáveis.

    Se os dados são linearmente separáveis, um perceptron encontrará esse hiperplano
    Equação: w0 + w1a1 + w2a2 + ... + wkak = 0
    - a1: atributo
    - w1: peso
    - w0: peso que pondera o bias (interceptor do hiperplano)

    wnovo = watual + (txaprendizagem * erro * sinal)
    erro = real - predito
    txaprendizagem = valor entre 0 e 1
    sinal = valor de ai

*/

let dados = [
    [1, 0, 0, 0],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 1, 1, 1]
];

class Perceptron {
    constructor(matriz) {
        this.matriz = matriz;
        this.modelo = {};
        for (let i = 0; i < this.matriz[0].length - 1; i++) {
            this.modelo[i] = {
                w: 0
            };

        }
        this.txaprendizagem = 1;
    }
    treina() {
        let iclasse = this.matriz[0].length - 1;
        let diferentes = 4;
        let ciclo = 1;
        while (diferentes > 0) {
            ciclo++;
            for (let i = 0; i < this.matriz.length; i++) {
                let f = this.prediz(this.matriz[i], true);
                if (f == this.matriz[i][iclasse]) diferentes--
                else {
                    diferentes++;
                    let erro = this.matriz[i][iclasse] - f;
                    for (let j = 0; j <= iclasse - 1; j++) {
                        this.modelo[j].w += (this.txaprendizagem * erro * this.matriz[i][j])
                    }
                }
            }
        }
    }
    prediz(dado, treino) {
        if (!treino) dado.unshift(1); // bias
        let soma = 0;
        for (let j = 0; j < dado.length - (treino ? 1 : 0) ; j++) {
            soma += this.modelo[j].w * dado[j];
        }
        return this.funcaoAtivacao(soma);
    }
    funcaoAtivacao(valor) {
        return valor > 0 ? 1 : 0;
    }
}

let p = new Perceptron(dados);
p.treina();
console.log(p.prediz([1,1]));