
let dados = [
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 0]
]

class Neuronio {
    constructor(attrs) {
        this.tipo = attrs.tipo;
        this.id = attrs.id;
        this.parent = this.parent || [];
        this.erro = 0;
        this.somas = {};
        this.pesosIniciais = attrs.pesosIniciais || [];
        if (this.tipo != 'saida') {
            this.neuronios = attrs.neuronios.map((n, index) => {
                n.parent.push(this);
                return {
                    neuronio: n,
                    peso: this.pesosIniciais[index]
                }
            });
        }
    }
    get ativacao() {
        // return this.tipo == 'entrada' ? this._ativacao : this.soma // identidade
        return this.tipo == 'entrada' ? this._ativacao : 1 / (1 + Math.pow(Math.E, -this.soma))
    }
    get derivada() {
        // return this.ativacao // identidade
        return this.ativacao * (1 - this.ativacao)
    }
    set ativacao(valor) {
        this._ativacao = valor || 0;
    }
    set soma(valor) {
        this._soma = valor;
    }
    get soma() {
        let sum = 0;
        Object.keys(this.somas).forEach(s => {
            sum += this.somas[s][0] * this.somas[s][1];
        })
        return sum;
    }
    get delta() {
        if (this.neuronios != null && this.neuronios.length > 0) {
            let sum = 0;
            this.neuronios.forEach(n => {
                sum += (n.neuronio.erro * n.peso);
            })
            return sum * this.derivada;
        } else {
            return this.erro * this.derivada;
        }
    }
    set delta(_d) {
        this._d = _d;
    }
}

class Backpropagation {
    constructor(matriz, pesosIniciais, nrClasses, epocas, txaprendizagem) {
        this.txaprendizagem = txaprendizagem;
        this.epocas = epocas;
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
        for (let ep = 0; ep < this.epocas; ep++) {
            // this.shuffleArray(this.matriz)
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
    }
    feedForward(neuronio, dado) {
        if (neuronio.neuronios != null && neuronio.neuronios.length > 0) {
            for (let i = 0; i < neuronio.neuronios.length; i++) {
                neuronio.neuronios[i].neuronio.somas[neuronio.id] = [neuronio.neuronios[i].peso, neuronio.ativacao]
                this.feedForward(neuronio.neuronios[i].neuronio, dado)
            }
        }
    }
    zeraDelta(neuronio) {
        if (neuronio.neuronios && neuronio.neuronios.length > 0) {
            neuronio.neuronios.forEach(n => {
                n.neuronio.delta = 0;
                this.zeraDelta(n.neuronio)
            })
        }
    }
    feedBackward(neuronio, dado) {
        // this.modelo.forEach(m => this.zeraDelta(m))
        // this.calculaDelta(neuronio, dado)
        this.neuroniosEntrada.forEach(n => {
            this.ajustaPesos(n, dado)
        })
    }
    ajustaPesos(neuronio, dado) {
        if (neuronio.neuronios && neuronio.neuronios.length > 0) {
            neuronio.neuronios.forEach(n => {

                n.peso += (this.txaprendizagem * n.neuronio.delta * n.neuronio.ativacao);

                
                // this.ajustaPesos(n.neuronio, dado)
                if (neuronio.parent && neuronio.parent.length > 0) {
                    neuronio.parent.forEach(p => {
                        this.ajustaPesos(p, dado)
                    })
                }
            })
        }
    }
    calculaDelta(neuronio, dado) {
        if (neuronio.neuronios != null && neuronio.neuronios.length > 0) {
            neuronio.neuronios.forEach(n => {
                neuronio.delta += (n.neuronio.erro * n.peso);
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
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    calculaErros(dado, neuronios) {
        let erros = [];
        neuronios.reverse().forEach((r, j) => {
            let erro = this.erro(dado[dado.length - j - 1], r.ativacao);
            if (erro !== 0) erros.push({
                neuronio: r,
                erro: erro
            })

            console.log(r.id, erro)
            r.erro = erro;
        })
        return erros;
    }
    erro(desejado, previsto) {
        return desejado - previsto;
        // return this.mse();
    }
    mse() {
        let sum = 0;
        this.matriz.forEach(m => {
            sum += Math.pow(this.prediz(m).resultado - m[this.matriz[0].length - 1], 2)
        })
        return sum / this.matriz.length;
    }
    rmse() {
        return Math.sqrt(this.mse())
    }
    resultado() {
        return this.neuroniosSaida.map(n => n.ativacao)
    }
    prediz(dado) {
        for (let j = 0; j < this.modelo.length; j++) {
            this.modelo[j].ativacao = dado[j]
            this.feedForward(this.modelo[j], dado[j])
        }
        return {
            resultado: this.resultado(),
            neuroniosSaida: this.neuroniosSaida
        }
    }
    criaNeuronios(pesosIniciais) {
        for (let i = 0; i < pesosIniciais.saida.length; i++) {
            if (pesosIniciais.saida[i] == 0)
                for (let j = 0; j < pesosIniciais.saida[i].length; j++)
                    pesosIniciais.saida[i][j] = Math.random() * 0.1;

            this.neuroniosSaida.push(new Neuronio({
                tipo: 'saida',
                id: 'y' + i,
                pesosIniciais: pesosIniciais.saida[i]
            }))
        }

        for (let i = 0; i < pesosIniciais.ocultos.length; i++) {
            if (pesosIniciais.ocultos[i] == 0)
                for (let j = 0; j < pesosIniciais.ocultos[i].length; j++)
                    pesosIniciais.ocultos[i][j] = Math.random() * 0.1;


            this.neuroniosOcultos.push(new Neuronio({
                tipo: 'oculto',
                id: 'z' + i,
                pesosIniciais: pesosIniciais.ocultos[i],
                neuronios: this.neuroniosSaida
            }))
        }

        for (let i = 0; i < pesosIniciais.entrada.length; i++) {
            if (pesosIniciais.entrada[i] == 0)
                for (let j = 0; j < pesosIniciais.entrada[i].length; j++)
                    pesosIniciais.entrada[i][j] = Math.random() * 0.1;

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
    entrada: [[0.1, 0.1], [0.1, 0.1], [0.1, 0.1]],
    ocultos: [[0.1], [0.1]],
    saida: [0]
}, 1, 10, 0.1);

bp.treina();

dados.forEach(d => console.log(bp.prediz(d).resultado))