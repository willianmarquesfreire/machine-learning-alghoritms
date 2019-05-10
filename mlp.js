class Peso {
    constructor(neuronio, valor) {
        this.neuronio = neuronio;
        // gaussian normal
        this.valor = valor === 0 ? Math.sqrt(-2 * Math.log(Math.random())) * Math.cos((2 * Math.PI) * Math.random()) : valor;
    }
}

class FuncaoAtivacao {
    constructor(fn) {
        this.fn = fn;
    }
    get(soma) {
        return this[this.fn](soma)
    }
    derivada(ativacao) {
        return this['derivada' + this.fn](ativacao)
    }
    step(soma) {
        if (soma >= 1)
            return 1
        return 0
    }
    linear(soma) {
        return soma
    }
    derivadalinear(ativacao) {
        return ativacao
    }
    derivadastep(ativacao) {
        return ativacao
    }
    sigmoid(soma) {
        return 1 / (1 + Math.pow(Math.E, -soma))
    }
    derivadasigmoid(ativacao) {
        return ativacao * (1 - ativacao)
    }
    tahn(soma) {
        return Math.tanh(soma)
        // return (Math.exp(soma) - Math.exp(-soma)) / (Math.exp(soma) - Math.exp(-soma))
    }
    derivadatahn(ativacao) {
        return 1 - Math.pow(ativacao, 2)
    }
    logistica(soma) {
        return 1 / (1 + Math.exp(-soma)) // == sigmoide
    }
    derivadalogistica(ativacao) {
        return ativacao * (1 - ativacao) // == sigmoide
    }
    atan(soma) {
        return Math.atan(soma)
    }
    derivadaatan(ativacao) {
        return 1 / (1 + Math.pow(ativacao, 2))
    }
    relu(soma) {
        if (soma >= 0)
            return soma
        return 0
    }
    derivadarelu(ativacao) {
        if (ativacao >= 0)
            return 1
        return 0
    }
    leakyrelu(soma) {
        if (soma >= 0)
            return soma
        return 0.01 * soma
    }
    derivadaleakyrelu(ativacao) {
        if (ativacao >= 0)
            return 1
        return 0.01
    }
    randomizedrelu(soma) {
        if (soma >= 0)
            return soma
        return Math.random() * 0.1 * soma
    }
    derivadarandomizedrelu(ativacao) {
        if (ativacao >= 0)
            return 1
        return Math.random() * 0.1
    }
    softmax(x) {
        return x.map((value) => {
            return Math.exp(value) / x.map((y) => Math.exp(y)).reduce((a, b) => a + b)
        })
    }
    derivadasoftmax(ativacao) {
        return 1 / (1 + Math.exp(-ativacao))
    }
}

class CamadaDensa {
    constructor(attrs) {
        this.pesos = attrs.pesos;
        this.id = attrs.id;
        if (!this.pesos) {
            this.pesos = [];
            for (let i = 0; i < attrs.qtdEntrada; i++) {
                if (attrs.qtdSaida > 0) {
                    let peso = [];
                    for (let j = 0; j < attrs.qtdSaida; j++) {
                        peso.push(0);
                    }
                    this.pesos.push(peso);
                } else {
                    this.pesos.push(0);
                }
            }
        }
        this.funcaoAtivacao = attrs.funcaoAtivacao;
    }
    inicializaCamada(entrada, saida) {
        this.entrada = entrada;
        this.saida = saida;
        this.inicializaVetor();
    }
    inicializaVetor() {
        let size = this.pesos.length;
        for (let j = 0; j < size; j++) {
            let neuronio = new Neuronio({
                ativacao: 0,
                delta: 0,
                pesos: this.pesos[j],
                camada: this.id,
                id: j,
                funcaoAtivacao: this.funcaoAtivacao
            });
            this.neuronios = this.neuronios || [];
            if (this.saida) {
                if (neuronio.pesos) {
                    neuronio.pesos = neuronio.pesos.map((peso, iPeso) => {
                        this.saida.neuronios[iPeso].parent = this.saida.neuronios[iPeso].parent || [];
                        this.saida.neuronios[iPeso].parent.push(neuronio)
                        return new Peso(this.saida.neuronios[iPeso], peso);
                    })
                }
            }
            this.neuronios.push(neuronio);
        }
    }
}

class Neuronio {
    constructor(attrs) {
        this.delta = attrs.delta;
        this.ativacao = attrs.ativacao;
        this.pesos = attrs.pesos;
        this.parent = attrs.parent;
        this.funcaoAtivacao = attrs.funcaoAtivacao;
        this.camada = attrs.camada;
        this.id = attrs.id;
    }
    get somatorio() {
        let sum = 0;
        if (this.parent && this.parent.length > 0) {
            this.parent.forEach(async (p) => {
                sum += (p.pesos[this.id].valor * p.ativacao);
            })
            return sum;
        } else {
            return this._ativacao;
        }
    }
    get ativacao() {
        this._ativacao = this.camada == 0 ? this._ativacao : this.funcaoAtivacao.get(this.somatorio)
        return this._ativacao
    }
    set ativacao(_ativacao) {
        this._ativacao = _ativacao;
    }
    derivada() {
        // return this.funcaoAtivacao.derivada(this.ativacao) //Tem mais acerto, mas é mais pesado
        return this.funcaoAtivacao.derivada(this._ativacao)
    }
    set delta(_delta) {
        this._delta = _delta;
    }
    get delta() {
        if (this.pesos && this.pesos instanceof Array) {
            let soma = 0;
            this.pesos.forEach(async (peso, i) => {
                soma += peso.valor * peso.neuronio.delta;
            });
            return soma * this.derivada();
        } else {
            return this.erro * this.derivada()
        }
    }
}

class MLP {
    constructor(attrs) {
        this.dados = attrs.dados;
        this.epocas = attrs.epocas;
        this.desejado = attrs.desejado[0] instanceof Array ? attrs.desejado : attrs.desejado.map(d => [d]);
        this.previsto = [];
        this.txaprendizagem = attrs.txaprendizagem;
        this.iEntrada = 0;
        this.showLogs = attrs.showLogs;
        this.camadas = attrs.camadas;
        for (let i = this.camadas.length - 1; i >= 0; i--) {
            this.camadas[i].id = i;
            this.camadas[i].inicializaCamada(this.camadas[i - 1], this.camadas[i + 1])

        }
        this.iSaida = this.camadas.length - 1;;
        if (this.showLogs) console.log("Rede Inicializada")
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
        this.desejado.forEach(async (dado, index) => {
            sum += Math.pow(this.minus(this.previsto[index], dado), 2)
        })
        return sum / this.desejado.length;
    }
    rmse() {
        return Math.sqrt(this.mse())
    }
    minus(vetor1, vetor2) {
        let res = 0;
        vetor1.forEach(async (v, i) => {
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
    async ajustaPeso(iCamada, i, j) {
        this.camadas[iCamada - 1].neuronios[i].pesos[j].valor += this.txaprendizagem
            * this.camadas[iCamada].neuronios[j].delta * this.camadas[iCamada - 1].neuronios[i].ativacao;
    }
    async atualizaPesos(iNeuronio, iCamada) {
        // console.log("Ajusta Pesos", iCamada, iNeuronio)
        if (this.camadas[iCamada - 1]) {
            this.camadas[iCamada - 1].neuronios.forEach(async (p1, i) => {
                this.camadas[iCamada - 1].pesos[i].forEach(async (p2, j) => {
                    this.ajustaPeso(iCamada, i, j)
                })
            })
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
    MLP: MLP,
    Neuronio: Neuronio,
    FuncaoAtivacao: FuncaoAtivacao,
    CamadaDensa: CamadaDensa,
    Peso: Peso
}