let dados = [
    [0, 0, 1],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
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
        if (this.neuronios && this.neuronios.length > 0) {
            let soma = 0;
            this.neuronios.forEach((neuronio, i) => {
                // console.log(this.camada, i, this.pesos[i], neuronio.delta)
                soma += this.pesos[i] * neuronio.delta;
            });
            return soma * this.derivada();
        } else {
            // console.log(this.camada, this.id, this.erro)
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
        this.pesosIniciais = attrs.pesos;
        this.txaprendizagem = attrs.txaprendizagem;
        this.iEntrada = 0;
        this.showLogs = attrs.showLogs;
        this.iSaida = this.pesosIniciais.length - 1;
        this.camadas = this.inicializaVetor(this.pesosIniciais);
        this.camadas.forEach((camada, iCamada) => {
            camada.forEach((neuronio, iNeuronio) => {
                neuronio.id = iNeuronio
                neuronio.camada = iCamada;
                if (neuronio.pesos) {
                    neuronio.neuronios = neuronio.neuronios || [];
                    neuronio.pesos.forEach((peso, iPeso) => {
                        if (peso = 0) peso = Math.random() * 0.1;
                        if (this.camadas[iCamada + 1]) {
                            neuronio.neuronios.push(this.camadas[iCamada + 1][iPeso])
                            this.camadas[iCamada + 1][iPeso].parent = this.camadas[iCamada + 1][iPeso].parent || [];
                            this.camadas[iCamada + 1][iPeso].parent.push(neuronio)
                        }
                    })
                }
            })
        })
        if (this.showLogs) console.log("Rede Inicializada")
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
    treina() {
        for (let epoca = 0; epoca < this.epocas; epoca++) {
            if (this.showLogs) console.log("Época: " + epoca)
            for (let i = 0; i < this.dados.length; i++) {
                this.ativacaoPrimeiraCamada(this.dados[i]);
                if (this.desejado[i] != this.camadas[this.iSaida].map(at => at.ativacao)) {
                    this.desejado[i].forEach((d, iNeuronio) => this.calculaErro(d, iNeuronio, this.iSaida))
                    this.previsto[i] = this.camadas[this.iSaida].map(saida => saida.ativacao);
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
        for (let i = 0; i < this.camadas[0].length; i++) {
            this.camadas[0][i].ativacao = dado[i];
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
        this.camadas[iCamada][iNeuronio].erro = desejado - this.camadas[iCamada][iNeuronio].ativacao;
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
    prediz(dado) {
        this.ativacaoPrimeiraCamada(dado);
        let values = this.camadas[this.iSaida].map(at => at.ativacao);
        let max = this.max(values);
        return {
            values: values,
            max: max
        }
    }
}

console.log("-----------> Binário")
// Probabilidade, binário

let desejado = [0, 1, 1, 0]

let pesos = [
    [[-0.424, -0.740, -0.961], [0.358, -0.577, -0.469], [0.1, 0.1, 0.1]],
    [[-0.017], [-0.893], [0.148]],
    [0]
];

let bp = new Backpropagation({
    pesos: pesos,
    txaprendizagem: 0.3,
    dados: dados,
    epocas: 2000,
    showLogs: false,
    desejado: desejado
});

bp.treina();

dados.forEach(dado => {
    console.log(bp.prediz(dado).values[0])
})

console.log("-----------> MultiClasse")
// Probabilidade, multiclasse
