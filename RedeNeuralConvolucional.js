// let m = require("./mlp");
// let MLP = m.MLP;
// let Neuronio = m.Neuronio;
// let FuncaoAtivacao = m.FuncaoAtivacao;
// let CamadaDensa = m.CamadaDensa;

/*
    Etapas:
    - Operador de convolução: Processo de adicionar 
    cada elemento da imagem para seus vizinhos, ponderado por um kernel
    A Imagem é uma matriz e o Kernel é outra matriz
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
    featureDetector() {
        // let kernel = [1, 0, 0, 1, 1, 1, 0, 1];
        let kernel = [0, 0.2, 0, 0.2, 0, 0.2, 0, 0.2];
        console.log(this.width, this.height);
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

                featureMapImageData.push(Math.round(sum[0] + (rgba[0] * kernel[0])));
                featureMapImageData.push(Math.round(sum[1] + (rgba[1] * kernel[1])));
                featureMapImageData.push(Math.round(sum[2] + (rgba[2] * kernel[2])));
                featureMapImageData.push(Math.round(sum[3] + (rgba[3] * kernel[3])));

            }
        }
        this.imageData = featureMapImageData;
        this.width = this.width - 3;
        this.height = this.height - 3;
    }


}


class Kernel {
    constructor(imagem, kernel) {
        this.imagem = imagem;
        this.kernel = kernel;
    }
    apply() {



        return this.imagem;
    }
}


let img = new Imagem("./rhino.png");
img.open(result => {
    // console.log(result.adjacencia(1, 1, 1));
    result.featureDetector();
    // console.log(result.adjacencia(1, 1, 1));
    console.log(result.getDataURL())
    require("fs").writeFile('out.png', result.getDataURL(), { encoding: 'base64' }, function (err) {
        console.log('File created');
    });

})