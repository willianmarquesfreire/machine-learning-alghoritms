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

class neuronio {
    constructor(attrs) {
        this.delta = attrs.delta;
        this.ativacao = attrs.ativacao;
        this.pesos = attrs.pesos;
    }
}

class Backpropagation {
    constructor(attrs) {
        this.dados = attrs.dados;
        this.epocas = attrs.epocas;
        this.desejado = attrs.desejado;
        this.previsto = [];
        this.pesosIniciais = attrs.pesos;
        this.txaprendizagem = attrs.txaprendizagem;
        this.iEntrada = 0;
        this.iSaida = this.pesosIniciais.length - 1;
        this.neuronios = this.inicializaVetor(this.pesosIniciais);
        // this.inicializa()
    }
    inicializa() {
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
    inicializaVetor(pesos) {
        let array = [];
        for (let i = 0; i < pesos.length; i++) {
            let size = pesos[i].length;
            array[i] = [];
            for (let j = 0; j < size; j++) {
                array[i].push(new neuronio({
                    ativacao: 0,
                    delta: 0,
                    pesos: pesos[i][j]
                }));
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
                if (this.desejado[i] != this.neuronios[this.iSaida][0].ativacao) {
                    this.previsto[i] = this.neuronios[this.iSaida][0].ativacao;
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
        for (let i = 0; i < this.neuronios[0].length; i++) {
            this.neuronios[0][i].ativacao = dado[i];
        }
    }
    feedForward(iCamada) {
        if (!iCamada) iCamada = 1;
        if (this.neuronios[iCamada]) {
            this.neuronios[iCamada] = this.multiplicacao(this.neuronios[iCamada], this.neuronios[iCamada - 1])
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
        if (this.neuronios[iCamada - 1]) {
            // console.log(this.pesos[iCamada - 1].toString())
            for (let i = 0; i < this.neuronios[iCamada - 1].length; i++) {
                for (let j = 0; j < this.neuronios[iCamada - 1][i].pesos.length; j++) {
                    this.neuronios[iCamada - 1][i].pesos[j] += this.txaprendizagem
                        * this.neuronios[iCamada][j].delta * this.neuronios[iCamada - 1][i].ativacao;
                }
            }
            // console.log(this.pesos[iCamada - 1].toString())
            this.atualizaPesos(iNeuronio, iCamada - 1)
        }
    }
    calculaDelta(desejado, iNeuronio, iCamada) {
        if (!iCamada) iCamada = this.iSaida;
        if (this.neuronios[iCamada]) {
            if (this.neuronios[iCamada + 1]) {
                for (let i = 0; i < this.neuronios[iCamada].length; i++) {
                    let soma = 0;
                    this.neuronios[iCamada][i].pesos.forEach(peso => {
                        soma += (peso * this.neuronios[iCamada + 1][iNeuronio].delta)
                    })
                    this.neuronios[iCamada][i].delta = this.derivada(this.neuronios[iCamada][i].ativacao) * soma;
                }
                if (iCamada > 1) this.calculaDelta(desejado, iNeuronio, iCamada - 1)
            } else {
                this.neuronios[iCamada][iNeuronio].delta = (desejado - this.neuronios[iCamada][iNeuronio].ativacao) * this.derivada(this.neuronios[iCamada][iNeuronio].ativacao)
                this.calculaDelta(desejado, iNeuronio, iCamada - 1)
            }
        }
    }
    multiplicacao(camada, ativacao) {
        let vetor = []
        for (let i = 0; i < ativacao.length; i++) {
            for (let j = 0; j < ativacao[i].pesos.length; j++) {
                vetor[j] = vetor[j] || 0;
                vetor[j] += ativacao[i].pesos[j] * ativacao[i].ativacao;
            }
        }
        return camada.map((v, i) => {
            v.ativacao = this.sigmoide(vetor[i]);
            return v
        });
    }
    prediz(dado) {
        this.ativacaoPrimeiraCamada(dado);
        this.feedForward();
        return this.neuronios[this.iSaida][0].ativacao
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
