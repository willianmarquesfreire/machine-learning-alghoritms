let m = require("./mlp");
let MLP = m.MLP;
let FuncaoAtivacao = m.FuncaoAtivacao;
let CamadaDensa = m.CamadaDensa;
let CamadaConvolucional = m.CamadaConvolucional;

let funcaoAtivacao = new FuncaoAtivacao('sigmoid');

let dados = [
    [0, 0, 1],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];

console.log("-----------> Binário")
// Probabilidade, binário


let desejado = [0, 1, 1, 0]

let bp = new MLP({
    camadas: [
        new CamadaConvolucional({ qtdEntrada: 3, qtdSaida: 3, funcaoAtivacao: funcaoAtivacao}),
        new CamadaDensa({ qtdEntrada: 3, qtdSaida: 3, funcaoAtivacao: funcaoAtivacao}),
        new CamadaDensa({ qtdEntrada: 3, qtdSaida: 1, funcaoAtivacao: funcaoAtivacao}),
        new CamadaDensa({ pesos: [0], funcaoAtivacao: funcaoAtivacao})
    ],
    txaprendizagem: 0.3,
    dados: dados,
    epocas: 4000,
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

bp = new MLP({
    txaprendizagem: 0.3,
    dados: dados,
    camadas: [
        new CamadaDensa({ pesos: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], funcaoAtivacao: funcaoAtivacao}),
        new CamadaDensa({ pesos: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], funcaoAtivacao: funcaoAtivacao}),
        new CamadaDensa({ pesos: [0, 0, 0], funcaoAtivacao: funcaoAtivacao})
    ],
    epocas: 2000,
    showLogs: false,
    desejado: desejado
});

bp.treina();

dados.forEach((dado, i) => {
    let obt = bp.prediz(dado);
    console.log("Esperado: " + desejado[i].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) + ", Obtido: " + obt.maxIndex)
})
