// FUNCIONA MARAVILHOSAMENTE *-*
let dados = [
    [0, 0, 1],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];

let desejado = [0, 1, 1, 0];
// desejado = [1]

let pesos = [
    [[-0.424, -0.740, -0.961], [0.358, -0.577, -0.469], [0.1, 0.1, 0.1]],
    [[-0.017], [-0.893], [0.148]],
    [0]
];

class Backpropagation {
    constructor(attrs) {
        this.dados = attrs.dados;
        this.epocas = attrs.epocas;
        this.desejado = attrs.desejado;
        this.previsto = [];
        this.pesos = attrs.pesos;
        this.txaprendizagem = attrs.txaprendizagem;
        this.iEntrada = 0;
        this.iSaida = this.pesos.length - 1;
        this.inicializa()
    }
    inicializa() {
        this.ativacao = this.inicializaVetor(this.pesos);
        this.delta = Object.assign([], this.ativacao);
        this.inicializaDelta(this.delta);
    }
    inicializaDelta(delta) {
        if (delta != null && delta.length > 0) {
            for (let i = 0; i < delta.length; i++) {
                if (!(delta[i] instanceof Array)) delta[i] = 0
                else this.inicializaDelta(delta[i])
            }
        }
    }
    inicializaVetor(ativacao) {
        let array = [];
        for (let i = 0; i < ativacao.length; i++) {
            let size = ativacao[i].length;
            array[i] = [];
            for (let j = 0; j < size; j++) {
                array[i].push(0);
            }
        }
        return array;
    }
    sigmoide(valor) {
        return 1 / (1 + Math.pow(Math.E, -valor))
    }
    derivada(valor) {
        return valor * (1 - valor)
    }
    treina() {
        for (let epoca = 0; epoca < this.epocas; epoca++) {
            console.log("Época: " + epoca)
            for (let i = 0; i < this.dados.length; i++) {
                this.inicializa();
                this.ativacaoPrimeiraCamada(this.dados[i]);
                this.feedForward();
                if (this.desejado[i] != this.ativacao[this.iSaida][0]) {
                    this.previsto[i] = this.ativacao[this.iSaida][0];
                    if (this.desejado[i] instanceof Array) this.desejado[i].forEach(d => this.feedBackward(d, i))
                    else this.feedBackward(this.desejado[i], 0)
                }
            }
            let sum = 0;
            this.desejado.forEach((dado, index) => {
                sum += Math.pow(this.previsto[index] - dado, 2)
            })
            console.log(sum / this.dados.length)
        }
    }
    ativacaoPrimeiraCamada(dado) {
        for (let i = 0; i < this.ativacao[0].length; i++) {
            this.ativacao[0][i] = dado[i];
        }
    }
    feedForward(iCamada) {
        if (!iCamada) iCamada = 1;
        if (this.ativacao[iCamada]) {
            this.ativacao[iCamada] = this.multiplicacao(this.ativacao[iCamada - 1], this.pesos[iCamada - 1])
            this.feedForward(iCamada + 1)
        }
    }
    feedBackward(desejado, iNeuronio, iCamada) {
        desejado = desejado + 0;
        iNeuronio = iNeuronio + 0;
        iCamada = this.iSaida;
        this.calculaDelta(desejado, iNeuronio, iCamada)
        iCamada = this.iSaida;
        this.atualizaPesos(iNeuronio, iCamada)
    }
    atualizaPesos(iNeuronio, iCamada) {
        if (this.pesos[iCamada - 1]) {
            // console.log(this.pesos[iCamada - 1].toString())
            for (let i = 0; i < this.pesos[iCamada - 1].length; i++) {
                for (let j = 0; j < this.pesos[iCamada - 1][i].length; j++) {
                    this.pesos[iCamada - 1][i][j] += this.txaprendizagem
                        * this.delta[iCamada][j] * this.ativacao[iCamada - 1][i];
                }
            }
            // console.log(this.pesos[iCamada - 1].toString())
            this.atualizaPesos(iNeuronio, iCamada - 1)
        }
    }
    calculaDelta(desejado, iNeuronio, iCamada) {
        if (!iCamada) iCamada = this.iSaida;
        if (this.delta[iCamada]) {
            if (this.delta[iCamada + 1]) {
                for (let i = 0; i < this.delta[iCamada].length; i++) {
                    let soma = 0;
                    this.pesos[iCamada][i].forEach(peso => {
                        soma += (peso * this.delta[iCamada + 1][iNeuronio])
                    })
                    this.delta[iCamada][i] = this.derivada(this.ativacao[iCamada][i]) * soma;
                }
                if (iCamada > 1) this.calculaDelta(desejado, iNeuronio, iCamada - 1)
            } else {
                this.delta[iCamada][iNeuronio] = (desejado - this.ativacao[iCamada]) * this.derivada(this.ativacao[iCamada])
                this.calculaDelta(desejado, iNeuronio, iCamada - 1)
            }
        }
    }
    multiplicacao(ativacao, pesos) {
        let vetor = []
        for (let i = 0; i < pesos.length; i++) {
            for (let j = 0; j < pesos[i].length; j++) {
                vetor[j] = vetor[j] || 0;
                vetor[j] += pesos[i][j] * ativacao[i];
            }
        }
        return vetor.map(v => this.sigmoide(v));
    }
    prediz(dado) {
        this.ativacaoPrimeiraCamada(dado);
        this.feedForward();
        return this.ativacao[this.iSaida]
    }
}

let bp = new Backpropagation({
    pesos: pesos,
    txaprendizagem: 0.3,
    dados: dados,
    epocas: 100000
    ,
    desejado: desejado
});

bp.treina();

dados.forEach(dado => {
    console.log(bp.prediz(dado))
})
