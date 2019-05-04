let m = require("./mlp");
let ma = require("./mlpMatriz");
let MLP = m.MLP;
let Neuronio = m.Neuronio;
let FuncaoAtivacao = m.FuncaoAtivacao;
let CamadaDensa = m.CamadaDensa;

/*
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
    detectorRGB(kernel) {
        let featureMapImageData = [];
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                let sum = [0, 0, 0, 0];
                this.adjacencia(x, y, 1).forEach((ad, index) => {
                    sum[0] += ad[0] * kernel[index];
                    sum[1] += ad[1] * kernel[index];
                    sum[2] += ad[2] * kernel[index];
                    sum[3] += ad[3] * kernel[index];
                });
                let rgba = this.getRGBA(this.get(x, y));

                let relu1 = Math.round(sum[0] + (rgba[0] * kernel[0]));
                let relu2 = Math.round(sum[1] + (rgba[1] * kernel[1]));
                let relu3 = Math.round(sum[2] + (rgba[2] * kernel[2]));
                let relu4 = Math.round(sum[3] + (rgba[3] * kernel[3]));

                featureMapImageData.push(relu1 >= 0 ? relu1 : 0);
                featureMapImageData.push(relu2 >= 0 ? relu2 : 0);
                featureMapImageData.push(relu3 >= 0 ? relu3 : 0);
                featureMapImageData.push(relu4 >= 0 ? relu4 : 0);

            }
        }
        this.imageData = featureMapImageData;
        this.width = this.width - 2;
        this.height = this.height - 2;
        return this;
    }
    featureDetectorRGB() {
        return this.detectorRGB([0, 0.2, 0, 0.2, 0, 0.2, 0, 0.2]);
    }
    maxPoolingRGB() {
        let mine = [];
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                let sum = [0, 0, 0, 0];
                this.adjacencia(x, y, 1).forEach((ad, index) => {
                    if (ad[0] > sum[0]) sum[0] = ad[0];
                    if (ad[1] > sum[1]) sum[1] = ad[1];
                    if (ad[2] > sum[2]) sum[2] = ad[2];
                    if (ad[3] > sum[3]) sum[3] = ad[3];
                });

                let rgba = this.getRGBA(this.get(x, y));
                if (rgba[0] > sum[0]) sum[0] = rgba[0];
                if (rgba[1] > sum[1]) sum[1] = rgba[1];
                if (rgba[2] > sum[2]) sum[2] = rgba[2];
                if (rgba[3] > sum[3]) sum[3] = rgba[3];

                mine.push(sum[0]);
                mine.push(sum[1]);
                mine.push(sum[2]);
                mine.push(sum[3]);

            }
        }
        this.imageData = mine;
        this.width = this.width - 2;
        this.height = this.height - 2;
        return this;
    }
    convolutional() {
        let r = [-1, -1, 1, -1, 1, 1, 0, 0, 1];
        let g = [1, 0, 0, -1, -1, 0, 1, 1, -1];
        let b = [0, 1, 1, 0, 1, -1, 1, 0, 1];

        let featureMap = [];
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                let sum = [0, 0, 0, 0];
                this.adjacencia(x, y, 1).forEach((ad, index) => {
                    sum[0] += ad[0] * r[index];
                    sum[1] += ad[1] * g[index];
                    sum[2] += ad[2] * b[index];
                });
                let rgba = this.getRGBA(this.get(x, y));

                let relu1 = Math.round(sum[0] + (rgba[0] * r[0]));
                let relu2 = Math.round(sum[1] + (rgba[1] * g[1]));
                let relu3 = Math.round(sum[2] + (rgba[2] * b[2]));

                let relu = relu1 + relu2 + relu3 + 1;

                featureMap.push(relu >= 0 ? relu : 0);
            }
        }
        this.imageData = featureMap;
        this.width = Math.round(this.width - 2);
        this.height = Math.round(this.height - 2);
        return this;
    }
    maxPooling() {
        let mine = [];
        for (let x = 0; x < this.imageData.length; x += 2) {
            let maior = 0;
            if (this.imageData[x] && this.imageData[x] > maior) maior = this.imageData[x];
            if (this.imageData[x + 1] && this.imageData[x + 1] > maior) maior = this.imageData[x + 1];
            if (this.imageData[x + this.width] && this.imageData[x + this.width] > maior) maior = this.imageData[x + this.width]
            if (this.imageData[x + this.width + 1] && this.imageData[x + this.width + 1] > maior) maior = this.imageData[x + this.width + 1];
            mine.push(maior);
        }
        this.imageData = mine;
        this.width = this.width - 2;
        this.height = this.height - 2;
        return this;
    }
    flattening() {
        return this.imageData;
    }

}

let dados = [

];

let desejado = [
]

let baseDados = [1, 2]
for (let id = 0; id < 2; id++) {
    let img = new Imagem((id + 1) + ".png");
    img.open(result => {
        dados.push(result.flattening())
        desejado.push(id)
        console.log(dados[0].length)
    })
}

setTimeout(function () {
    console.log("oi",dados.length)
    let bp = new ma.Backpropagation({
        txaprendizagem: 0.3,
        dados: dados,
        ativacao: 'sigmoide',
        epocas: 10,
        desejado: desejado
    });
    bp.treina();
}, 4000)




// img = new Imagem("./2.png");
// img.open(result => {
//     dados.push(result.flattening())
//     bp.dados = dados;
//     bp.desejado = desejado;
//     console.log(dados[0].length)
//     desejado.push([1])
//     bp.treina();
// })