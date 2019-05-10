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

class Neuronio {
    constructor(attrs) {
        this.delta = attrs.delta;
        this.ativacao = attrs.ativacao;
        this.pesos = attrs.pesos;
        this.neuronios = attrs.neuronios;
        this.parent = attrs.parent;
        this.camada = attrs.camada;
        this.id = attrs.id;
    }
    get somatorio() {
        let sum = 0;
        if (this.parent && this.parent.length > 0) {
            this.parent.forEach(p => {
                sum += (p.pesos[this.id] * p.ativacao);
            })
            return sum;
        } else {
            return this.ativacao;
        }
    }
    get ativacao() {
        return this.camada == 0 ? this._ativacao : (this.sigmoide(this.somatorio))
    }
    set ativacao(_ativacao) {
        this._ativacao = _ativacao;
    }
    sigmoide(valor) {
        return 1 / (1 + Math.pow(Math.E, -valor))
    }
    derivada(valor) {
        return valor * (1 - valor)
    }
    // set delta(_delta) {
    //     this._delta = _delta;
    // }
    // get delta() {}
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
        this.camadas = this.inicializaVetor(this.pesosIniciais);
        this.camadas.forEach((camada, iCamada) => {
            camada.forEach((neuronio, iNeuronio) => {
                neuronio.id = iNeuronio
                neuronio.camada = iCamada;
                if (neuronio.pesos) {
                    neuronio.neuronios = neuronio.neuronios || [];
                    neuronio.pesos.forEach((peso, iPeso) => {
                        if (this.camadas[iCamada + 1]) {
                            neuronio.neuronios.push(this.camadas[iCamada + 1][iPeso])
                            this.camadas[iCamada + 1][iPeso].parent = this.camadas[iCamada + 1][iPeso].parent || [];
                            this.camadas[iCamada + 1][iPeso].parent.push(neuronio)
                        }
                    })
                }
            })
        })
        console.log("Rede Inicializada")
    }
    inicializaVetor(pesos) {
        let array = [];
        for (let i = 0; i < pesos.length; i++) {
            let size = pesos[i].length;
            array[i] = [];
            for (let j = 0; j < size; j++) {
                let neuronio = new Neuronio({
                    ativacao: 0,
                    delta: 0,
                    pesos: pesos[i][j]
                });
                array[i].push(neuronio);
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
            for (let i = 0; i < this.dados.length; i++) {
                this.ativacaoPrimeiraCamada(this.dados[i]);
                this.feedForward();
                if (this.desejado[i] != this.camadas[this.iSaida][0].ativacao) {
                    this.previsto[i] = this.camadas[this.iSaida][0].ativacao;
                    if (this.desejado[i] instanceof Array) this.desejado[i].forEach(d => this.feedBackward(d, i))
                    else this.feedBackward(this.desejado[i], 0)
                }
            }
            let sum = 0;
            this.desejado.forEach((dado, index) => {
                sum += Math.pow(this.previsto[index] - dado, 2)
            })
        }
    }
    ativacaoPrimeiraCamada(dado) {
        for (let i = 0; i < this.camadas[0].length; i++) {
            this.camadas[0][i].ativacao = dado[i];
        }
    }
    feedForward(iCamada) {
        if (!iCamada) iCamada = 1;
        if (this.camadas[iCamada]) {
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
        if (this.camadas[iCamada - 1]) {
            for (let i = 0; i < this.camadas[iCamada - 1].length; i++) {
                for (let j = 0; j < this.camadas[iCamada - 1][i].pesos.length; j++) {
                    this.camadas[iCamada - 1][i].pesos[j] += this.txaprendizagem
                        * this.camadas[iCamada][j].delta * this.camadas[iCamada - 1][i].ativacao;
                }
            }
            this.atualizaPesos(iNeuronio, iCamada - 1)
        }
    }
    calculaDelta(desejado, iNeuronio, iCamada) {
        if (!iCamada) iCamada = this.iSaida;
        // if (this.neuronios && this.neuronios.length > 0) {
        //     let soma = 0;
        //     this.neuronios.forEach((neuronio, i) => {
        //         soma += this.pesos[i] * neuronio.delta;
        //     });
        //     return soma * this.derivada();
        // } else {
        //     return this.erro * this.derivada()
        // }
        if (this.camadas[iCamada]) {
            if (this.camadas[iCamada + 1]) {
                for (let i = 0; i < this.camadas[iCamada].length; i++) {
                    let soma = 0;
                    this.camadas[iCamada][i].pesos.forEach(peso => {
                        console.log(peso, this.camadas[iCamada + 1][iNeuronio].delta)
                        soma += (peso * this.camadas[iCamada + 1][iNeuronio].delta)
                    })
                    this.camadas[iCamada][i].delta = this.derivada(this.camadas[iCamada][i].ativacao) * soma;
                }
                if (iCamada > 1) this.calculaDelta(desejado, iNeuronio, iCamada - 1)
            } else {
                this.camadas[iCamada][iNeuronio].delta = (desejado - this.camadas[iCamada][iNeuronio].ativacao) * this.derivada(this.camadas[iCamada][iNeuronio].ativacao)
                this.calculaDelta(desejado, iNeuronio, iCamada - 1)
            }
        }
    }
    prediz(dado) {
        this.ativacaoPrimeiraCamada(dado);
        this.feedForward();
        return this.camadas[this.iSaida][0].ativacao
    }
}

let bp = new Backpropagation({
    pesos: pesos,
    txaprendizagem: 0.3,
    dados: dados,
    epocas: 2
    ,
    desejado: desejado
});

bp.treina();

dados.forEach(dado => {
    console.log(bp.prediz(dado))
})