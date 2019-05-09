let m = require("./mlp");
let MLP = m.MLP;
let Neuronio = m.Neuronio;
let FuncaoAtivacao = m.FuncaoAtivacao;
let CamadaDensa = m.CamadaDensa;

/*
https://towardsdatascience.com/a-comprehensive-guide-to-convolutional-neural-networks-the-eli5-way-3bd2b1164a53
    obs: A Imagem é uma matriz e o Kernel é outra matriz
    Etapas:
    - Operador de convolução(Processo de adicionar 
    cada elemento da imagem para seus vizinhos, ponderado por um kernel)
    - Pooling
    - Fattening
    - Rede neural densa
*/

let canvas = require('canvas');

let image = require('get-image-data');


class Imagem {
    constructor(url) {
        this.url = url;
    }
    open(fn) {
        image(this.url, (err, info) => {
            this.imageData = info.data
            this.height = info.height
            this.width = info.width;
            fn(this)
        })
    }
    getDataURL() {
        let cv = canvas.createCanvas(this.width, this.height);
        let data = cv.getContext('2d').createImageData(this.width, this.height);
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = this.imageData[i];
            data.data[i + 1] = this.imageData[i + 1];
            data.data[i + 2] = this.imageData[i + 2];
            data.data[i + 3] = this.imageData[i + 3];
        }
        cv.getContext('2d').putImageData(data, 0, 0);

        return cv.toBuffer();
    }
    saveDataURL() {
        require("fs").writeFile('out.png', this.getDataURL(), { encoding: 'base64' }, function (err) {
            console.log('File created');
        });
    }
    get(x, y) {
        let data = this.imageData;
        return [
            x * 4 + (y * this.width * 4),
            x * 4 + (y * this.width * 4) + 1,
            x * 4 + (y * this.width * 4) + 2,
            x * 4 + (y * this.width * 4) + 3
        ]
    }
    set(x, y, rgba) {
        let pos = this.get(x, y);
        pos.forEach((p, i) => this.imageData[p] = rgba[i]);
        return this;
    }
    getRGBA(pos) {
        return pos ? [
            this.imageData[pos[0]],
            this.imageData[pos[1]],
            this.imageData[pos[2]],
            this.imageData[pos[3]]
        ] : null;
    }
    around(x, y, level, fn) {
        x = x - level;
        y = y - level;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < level * 2; j++) {
                fn(x, y)
                if (i == 0) x++
                if (i == 1) y++
                if (i == 2) x--
                if (i == 3) y--
            }
        }
    }
    adjacenciaPos(x, y, level) {
        let adj = [];
        this.around(x + 0, y + 0, level, (newX, newY) => {
            if (newX >= 0 && newY >= 0 && newX < this.width
                && newY < this.height) {
                adj.push(this.get(newX, newY));
            } else {
                adj.push(null)
            }
        })
        return adj;
    }
    adjacencia(x, y, level) {
        let pos = this.adjacenciaPos(x, y, level);
        return pos.map(p => this.getRGBA(p));
    }
    convolutionalRGB() {
        let r = [
            -1, -1, 1,
            0, 1, -1,
            0, 1, 1
        ]
        let g = [
            1, 0, 0,
            1, -1, -1,
            1, 0, -1
        ]
        let b = [
            0, 1, 1,
            0, 1, 0,
            1, -1, 1
        ]
        let novaMatriz = [];
        for (let x = 1; x < this.width - 1; x++) {
            for (let y = 1; y < this.height - 1; y++) {
                let adj = this.adjacencia(x, y, 1);
                let somaR = 0;
                let somaG = 0;
                let somaB = 0;
                for (let z = 0; z < adj.length; z++) {
                    somaR += adj[z][0] * r[z];
                    somaG += adj[z][1] * r[z];
                    somaB += adj[z][2] * r[z];
                }
                novaMatriz.push(somaR + somaG + somaB + 1);
            }
        }
        this.imageData = novaMatriz;
        this.width = Math.sqrt(this.imageData.length);
        this.height = Math.sqrt(this.imageData.length);
        return this;
    }
    maxPooling() {
        let novaMatriz = [];
        for (let y = 0; y < this.height - 1; y += 2) {
            for (let x = 0; x < this.width - 1; x += 2) {
                let maior = Number.MIN_SAFE_INTEGER;
                // console.log((y * this.width) + x, ((y * this.width) + x + this.height))
                let adj0 = this.imageData[(y * this.width) + x];
                let adj1 = this.imageData[(y * this.width) + x + 1];
                let adj2 = this.imageData[((y * this.width) + x + this.height)];
                let adj3 = this.imageData[((y * this.width) + x + this.height) + 1];
                // console.log(adj0, adj1, adj2, adj3)
                if (adj0 > maior) maior = adj0;
                if (adj1 > maior) maior = adj1;
                if (adj2 > maior) maior = adj2;
                if (adj3 > maior) maior = adj3;

                novaMatriz.push(maior)
            }
        }
        this.imageData = novaMatriz;
        this.width = Math.sqrt(this.imageData.length);
        this.height = Math.sqrt(this.imageData.length);
        return this;
    }
    flattening() {
        return this.imageData;
    }

}

let img = new Imagem("./rhino.png");
img.open(result => {

    let dados = [
        result.convolutionalRGB().maxPooling().maxPooling().maxPooling().flattening()
    ];

    let desejado = [
        [0]
    ]

    result.saveDataURL()

    // console.log(dados[0])
    console.log("===>", result.imageData.length)

    let funcaoAtivacao = new FuncaoAtivacao('relu');

    let bp = new MLP({
        txaprendizagem: 0.3,
        dados: dados,
        camadas: [
            new CamadaDensa({ qtdEntrada: dados[0].length, qtdSaida: Math.round(dados[0].length / 2), funcaoAtivacao: funcaoAtivacao }),
            new CamadaDensa({ qtdEntrada: Math.round(dados[0].length / 2), qtdSaida: 1, funcaoAtivacao: funcaoAtivacao }),
            new CamadaDensa({ pesos: [0], funcaoAtivacao: funcaoAtivacao })
        ],
        epocas: 10,
        showLogs: true,
        desejado: desejado
    });

    bp.treina();

    dados.forEach((dado, i) => {
        let obt = bp.prediz(dado);
        console.log("Esperado: " + desejado[i].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) + ", Obtido: " + obt.maxIndex)
    })
})
