/* Equação da reta: Y = aX + b
b: coeficiente linear, intercepto. É o valor que y assume quando x tende a 0
a: coeficiente angular: é a inclinação da reta. Mede o aumento ou redução em y para cada aumento de x
*/

let dados = [[908, 11.20],
[926, 11.05],
[506, 6.84],
[741, 9.21],
[789, 9.42],
[889, 10.08],
[874, 9.45],
[510, 6.73],
[529, 7.24],
[420, 6.12],
[679, 7.63],
[872, 9.43],
[924, 9.46],
[607, 7.64],
[452, 6.92],
[729, 8.95],
[794, 9.33],
[844, 10.23],
[1010, 11.77],
[621, 7.41]];

class RegressaoLinear {
    constructor(matriz) {
        this.matriz = matriz;
        this.modelo = this.matriz;
        this.a = 0.0;
        this.b = 0.0;
    }
    treina() {
        let soma = [0,0,0,0];
        for(let i = 0; i < this.modelo.length; i++) {
            this.modelo[i][2] = this.modelo[i][0] * this.modelo[i][0];
            this.modelo[i][3] = this.modelo[i][0] * this.modelo[i][1];
            soma[0] += this.modelo[i][0];
            soma[1] += this.modelo[i][1];
            soma[2] += this.modelo[i][2];
            soma[3] += this.modelo[i][3];
        }
        let mediaX = soma[0] / this.modelo.length;
        let mediaY = soma[1] / this.modelo.length;
        this.a = soma[3] - this.modelo.length * mediaX * mediaY;
        this.a /= soma[2] - this.modelo.length * Math.pow(mediaX, 2);
        this.b = mediaY - this.a * mediaX;
    }
    prediz(x) {
        return this.a * x + this.b;
    }
}

let rl = new RegressaoLinear(dados);
rl.treina();
console.log(rl.prediz(907));