class Peso {
    constructor(neuronio, valor) {
        this.neuronio = neuronio;
        this.valor = valor;
    }
}

class CamadaDensa {
    constructor(attrs) {
        this.pesos = attrs.pesos;
        this.neuronios = [];
    }
}

class Neuronio {
    constructor(attrs) {
        this.delta = attrs.delta;
        this.ativacao = attrs.ativacao;
        this.pesos = attrs.pesos;
        this.parent = attrs.parent;
        this.camada = attrs.camada;
        this.id = attrs.id;
    }
    get somatorio() {
        let sum = 0;
        if (this.parent && this.parent.length > 0) {
            this.parent.forEach(p => {
                sum += (p.pesos[this.id].valor * p.ativacao);
            })
            if (Number.isNaN(sum)) debugger
            return sum;
        } else {
            return this._ativacao;
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
    derivada() {
        return this.ativacao * (1 - this.ativacao)
    }
    set delta(_delta) {
        this._delta = _delta;
    }
    get delta() {
        if (this.pesos && this.pesos instanceof Array) {
            let soma = 0;
            this.pesos.forEach((peso, i) => {
                soma += peso.valor * peso.neuronio.delta;
            });
            if (Number.isNaN(soma * this.derivada())) debugger
            return soma * this.derivada();
        } else {
            if (Number.isNaN(this.erro * this.derivada())) debugger
            return this.erro * this.derivada()
        }
    }
}

class Backpropagation {
    constructor(attrs) {
        this.dados = attrs.dados;
        this.epocas = attrs.epocas;
        this.desejado = attrs.desejado[0] instanceof Array ? attrs.desejado : attrs.desejado.map(d => [d]);
        this.previsto = [];
        this.txaprendizagem = attrs.txaprendizagem;
        this.iEntrada = 0;
        this.showLogs = attrs.showLogs;
        this.camadas = attrs.camadas;
        this.iSaida = this.camadas.length - 1;
        this.inicializaVetor(this.camadas);
        if (this.showLogs) console.log("Rede Inicializada")
    }
    inicializaVetor(camadas) {
        for (let i = camadas.length - 1; i >= 0; i--) {
            let size = camadas[i].pesos.length;
            for (let j = 0; j < size; j++) {
                let neuronio = new Neuronio({
                    ativacao: 0,
                    delta: 0,
                    pesos: camadas[i].pesos[j],
                    camada: i,
                    id: j
                });
                if (this.camadas[i + 1]) {
                    neuronio.pesos = neuronio.pesos.map((peso, iPeso) => {
                        if (peso == 0) peso = Math.random() * 0.1;
                        this.camadas[i + 1].neuronios[iPeso].parent = this.camadas[i + 1].neuronios[iPeso].parent || [];
                        this.camadas[i + 1].neuronios[iPeso].parent.push(neuronio)
                        return new Peso(this.camadas[i + 1].neuronios[iPeso], peso);
                    })
                }
                this.camadas[i].neuronios.push(neuronio);
            }
        }
    }
    treina() {
        for (let epoca = 0; epoca < this.epocas; epoca++) {
            if (this.showLogs) console.log("Época: " + epoca)
            for (let i = 0; i < this.dados.length; i++) {
                this.ativacaoPrimeiraCamada(this.dados[i]);
                if (this.desejado[i] != this.camadas[this.iSaida].neuronios.map(at => at.ativacao)) {
                    this.desejado[i].forEach((d, iNeuronio) => this.calculaErro(d, iNeuronio, this.iSaida))
                    this.previsto[i] = this.camadas[this.iSaida].neuronios.map(saida => saida.ativacao);
                    this.desejado[i].forEach((d, j) => this.feedBackward(d, j))
                }
            }

            if (this.showLogs) {
                console.log(this.rmse())
            }
        }
    }
    mse() {
        let sum = 0;
        this.desejado.forEach((dado, index) => {
            sum += Math.pow(this.minus(this.previsto[index], dado), 2)
        })
        return sum / this.desejado.length;
    }
    rmse() {
        return Math.sqrt(this.mse())
    }
    minus(vetor1, vetor2) {
        let res = 0;
        vetor1.forEach((v, i) => {
            res += v - vetor2[i]
        })
        return res;
    }
    ativacaoPrimeiraCamada(dado) {
        for (let i = 0; i < this.camadas[0].neuronios.length; i++) {
            this.camadas[0].neuronios[i].ativacao = dado[i];
        }
    }
    max(obt) {
        return obt.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    }
    feedBackward(desejado, iNeuronio, iCamada) {
        desejado = desejado + 0;
        iNeuronio = iNeuronio + 0;
        iCamada = this.iSaida;
        this.atualizaPesos(iNeuronio, iCamada)
    }
    calculaErro(desejado, iNeuronio, iCamada) {
        this.camadas[iCamada].neuronios[iNeuronio].erro = desejado - this.camadas[iCamada].neuronios[iNeuronio].ativacao;
    }
    atualizaPesos(iNeuronio, iCamada) {
        if (this.camadas[iCamada - 1]) {
            for (let i = 0; i < this.camadas[iCamada - 1].neuronios.length; i++) {
                for (let j = 0; j < this.camadas[iCamada - 1].pesos[i].length; j++) {
                    this.camadas[iCamada - 1].neuronios[i].pesos[j].valor += this.txaprendizagem
                        * this.camadas[iCamada].neuronios[j].delta * this.camadas[iCamada - 1].neuronios[i].ativacao;
                }
            }
            this.atualizaPesos(iNeuronio, iCamada - 1)
        }
    }
    prediz(dado) {
        this.ativacaoPrimeiraCamada(dado);
        let values = this.camadas[this.iSaida].neuronios.map(at => at.ativacao);
        let maxIndex = this.max(values);
        return {
            values: values,
            maxIndex: maxIndex,
            maxValue: values[maxIndex]
        }
    }
}

module.exports = {
    Backpropagation: Backpropagation,
    Neuronio: Neuronio
}

let dados = [
    [0, 0, 1],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];

console.log("-----------> Binário")
// Probabilidade, binário

let desejado = [0, 1, 1, 0]

let bp = new Backpropagation({
    camadas: [
        new CamadaDensa({pesos: [[-0.424, -0.740, -0.961], [0.358, -0.577, -0.469], [0.1, 0.1, 0.1]]}),
        new CamadaDensa({pesos: [[-0.017], [-0.893], [0.148]]}),
        new CamadaDensa({pesos: [0]})
    ],
    txaprendizagem: 0.3,
    dados: dados,
    epocas: 10000,
    showLogs: false,
    desejado: desejado
});

bp.treina();

dados.forEach(dado => {
    console.log(bp.prediz(dado).maxValue)
})

console.log("-----------> MultiClasse")
// Probabilidade, multiclasse

dados = [
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1],
    [0, 1, 0, 1, 1],
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [2, 0, 0, 1, 1],
    [2, 0, 1, 1, 1],
    [2, 0, 1, 1, 1],
    [2, 0, 0, 0, 1],
    [2, 1, 1, 1, 1],
    [2, 1, 0, 1, 1],
];
// nenhuma, gelatinosa, dura
// desejado = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
desejado = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
    [0, 0, 1],
    [0, 1, 0],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 1, 0]
];


bp = new Backpropagation({
    txaprendizagem: 0.3,
    dados: dados,
    camadas: [
        new CamadaDensa({pesos: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]}),
        new CamadaDensa({pesos: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]}),
        new CamadaDensa({pesos: [0, 0, 0]})
    ],
    epocas: 1000,
    showLogs: false,
    desejado: desejado
});

bp.treina();

dados.forEach((dado, i) => {
    let obt = bp.prediz(dado);
    console.log("Esperado: " + desejado[i].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) + ", Obtido: " + obt.maxIndex)
})
