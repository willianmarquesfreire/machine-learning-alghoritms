let m = require("./mlp");
let MLP = m.MLP;
let FuncaoAtivacao = m.FuncaoAtivacao;
let Neuronio = m.Neuronio;
let CamadaDensa = m.CamadaDensa;

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

let entrada = new CamadaDensa({ pesos: [[-0.424, -0.740, -0.961], [0.358, -0.577, -0.469], [0.1, 0.1, 0.1]], funcaoAtivacao: funcaoAtivacao});
let oculta = new CamadaDensa({ pesos: [[-0.017], [-0.893], [0.148]], funcaoAtivacao: funcaoAtivacao});
let saida = new CamadaDensa({ pesos: [0], funcaoAtivacao: funcaoAtivacao});

let bp = new MLP({
    camadas: [entrada, oculta, saida],
    txaprendizagem: 0.3,
    dados: dados,
    epocas: 2000,
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
