
let dados = [
    [0, 0, 0],
    // [0, 1, 1],
    // [1, 0, 1],
    // [1, 1, 0]
]

class Neuronio {
    constructor(attrs) {
        this.tipo = attrs.tipo;
        this.id = attrs.id;
        this.parent = this.parent || [];
        this.delta = 0;
        this.erro = 0;
        this.somas = {};
        this.pesosIniciais = attrs.pesosIniciais || [];
        if (this.tipo != 'saida') {
            this.neuronios = attrs.neuronios.map((n, index) => {
                n.parent.push(this);
                return {
                    neuronio: n,
                    peso: this.pesosIniciais[index]                }
            });
        }
    }
    get ativacao() {
        return this.tipo == 'entrada' ? this._ativacao : 1 / (1 + Math.pow(Math.E, -this.soma))
    }
    get derivada() {
        return this.ativacao * (1 - this.ativacao)
    }
    set ativacao(valor) {
        this._ativacao = valor || 0;
    }
    set soma(valor) {
        this._soma = valor || 0;
    }
    get soma() {
        let sum = 0;
        Object.keys(this.somas).forEach(s => {
            sum += this.somas[s][0] * this.somas[s][1];
        })
        return sum;
    }
}

class Backpropagation {
    constructor(matriz, pesosIniciais, nrClasses) {
        this.txaprendizagem = 0.3
        this.matriz = matriz;
        this.nrNeuroniosEntrada = pesosIniciais.entrada.length;
        this.nrNeuroniosOculto = pesosIniciais.entrada.length;
        this.nrNeuroniosSaida = pesosIniciais.saida.length;
        this.neuroniosSaida = [];
        this.neuroniosOcultos = [];
        this.neuroniosEntrada = [];
        this.nrClasses = nrClasses;
        this.modelo = this.criaNeuronios(pesosIniciais);
    }
    treina() {
        for (let i = 0; i < this.matriz.length; i++) {
            for (let j = 0; j < this.modelo.length; j++) {
                this.modelo[j].ativacao = this.matriz[i][j]
                this.feedForward(this.modelo[j], this.matriz[i])
            }

            let erros = this.calculaErros(this.matriz[i], this.neuroniosSaida)
            if (erros.length > 0) {
                for (let j = 0; j < this.neuroniosSaida.length; j++) {
                    this.feedBackward(this.neuroniosSaida[j], this.matriz[i])
                }
            }
        }

    }
    feedForward(neuronio, dado) {
        if (neuronio.neuronios != null && neuronio.neuronios.length > 0) {
            for (let i = 0; i < neuronio.neuronios.length; i++) {
                neuronio.neuronios[i].neuronio.somas[neuronio.id] = [neuronio.neuronios[i].peso, neuronio.ativacao]
                this.feedForward(neuronio.neuronios[i].neuronio, dado)
            }
        }
    }
    feedBackward(neuronio, dado) {
        this.calculaDelta(neuronio, dado)
        this.modelo.forEach(n => {
            this.ajustaPesos(n, dado)
        })

        console.log(neuronio.erro)
    }
    ajustaPesos(neuronio, dado) {
        if (neuronio.neuronios && neuronio.neuronios.length > 0) {
            neuronio.neuronios.forEach(n => {
                console.log(n.peso + " -> ")
                n.peso += this.txaprendizagem * n.neuronio.delta * n.neuronio.ativacao;
                console.log(n.peso)
            })
        }
    }
    calculaDelta(neuronio, dado) {
        if (neuronio.tipo == 'entrada') return;
        if (neuronio.neuronios != null && neuronio.neuronios.length > 0) {
            // neuronio.neuronios.forEach(n => {
            //     n.delta = ;
            // })

            neuronio.neuronios.forEach(n => {
                neuronio.delta += n.neuronio.erro * n.peso;
            })
            neuronio.delta *= neuronio.derivada;
        } else {
            neuronio.delta = neuronio.erro * neuronio.derivada;
        }
        if (neuronio.parent != null && neuronio.parent.length > 0) {
            neuronio.parent.forEach(n => {
                this.calculaDelta(n, dado)
            })
        }
    }
    calculaErros(dado, neuronios) {
        let erros = [];
        neuronios.reverse().forEach((r, j) => {
            let erro = this.erro(dado[this.nrClasses - j - 1], r.ativacao);
            if (erro !== 0) erros.push({
                neuronio: r,
                erro: erro
            })
            r.erro = erro;
        })
        return erros;
    }
    erro(desejado, previsto) {
        return desejado - previsto;
    }
    soma(neuronio, dado) {

    }
    prediz(dado) {

    }
    criaNeuronios(pesosIniciais) {
        for (let i = 0; i < pesosIniciais.saida.length; i++) {
            this.neuroniosSaida.push(new Neuronio({
                tipo: 'saida',
                id: 'y' + i,
                pesosIniciais: pesosIniciais.saida[i]
            }))
        }

        for (let i = 0; i < pesosIniciais.ocultos.length; i++) {

            this.neuroniosOcultos.push(new Neuronio({
                tipo: 'oculto',
                id: 'z' + i,
                pesosIniciais: pesosIniciais.ocultos[i],
                neuronios: this.neuroniosSaida
            }))
        }

        for (let i = 0; i < pesosIniciais.entrada.length; i++) {
            this.neuroniosEntrada.push(new Neuronio({
                tipo: 'entrada',
                id: 'x' + i,
                pesosIniciais: pesosIniciais.entrada[i],
                neuronios: this.neuroniosOcultos
            }))
        }

        return this.neuroniosEntrada;
    }
}


let bp = new Backpropagation(dados, {
    entrada: [[-0.424, -0.740, -0.961], [0.358, -0.577, -0.469]],
    ocultos: [[-0.017], [-0.893], [0.148]],
    saida: [0]
}, 1);

bp.treina();