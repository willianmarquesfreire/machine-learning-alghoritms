import copy
import math

dados = [
    [0, 0, 1],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
]

desejado = [0, 1, 1, 0]

pesos = [
    [[-0.424, -0.740, -0.961], [0.358, -0.577, -0.469], [0.1, 0.1, 0.1]],
    [[-0.017], [-0.893], [0.148]],
    [0]
]


class MLP:
    def __init__(self, txAprendizagem=0.3, pesos=None, dados=None, epocas=1, desejado=None):
        self.txAprendizagem = txAprendizagem
        self.pesos = pesos
        self.ativacao = self.zeraLista(copy.deepcopy(pesos))
        self.delta = self.zeraLista(copy.deepcopy(pesos))
        self.dados = copy.deepcopy(dados)
        self.iSaida = len(self.pesos) - 1
        self.epocas = epocas
        self.desejado = desejado
        self.previsto = []

    def zeraLista(self, lista):
        for i in range(len(lista)):
            for j in range(len(lista[i])):
                lista[i][j] = 0
        return lista

    def zeraListaRecursiva(self, lista):
        for i in range(len(lista)):
            if type(lista[i]) is list:
                self.zeraListaRecursiva(lista[i])
            else:
                lista[i] = 0
        return lista

    def ativacaoPrimeiraCamada(self, dado):
        self.ativacao[0] = dado

    def multiplicacao(self, ativacao, pesos):
        vetor = []
        for i in range(len(pesos)):
            for j in range(len(pesos[i])):
                try:
                    vetor[j]
                except:
                    vetor.append(0)
                vetor[j] += pesos[i][j] * ativacao[i]
        return [self.sigmoid(v) for v in vetor]

    def feedForward(self, iCamada=1):
        if iCamada <= self.iSaida:
            self.ativacao[iCamada] = self.multiplicacao(
                self.ativacao[iCamada-1], self.pesos[iCamada-1])
            self.feedForward(iCamada + 1)

    def sigmoid(self, valor):
        return 1 / (1 + math.pow(math.e, -valor))

    def derivada(self, valor):
        return valor * (1 - valor)

    def calculaDelta(self, desejado, iNeuronio, iCamada):
        iCamada = (iCamada, self.iSaida)[iCamada is None]
        if iCamada <= self.iSaida:
            if (iCamada + 1) <= self.iSaida:
                for i in range(len(self.delta[iCamada])):
                    soma = 0
                    for peso in self.pesos[iCamada][i]:
                        soma += (peso * self.delta[iCamada + 1][iNeuronio])
                    self.delta[iCamada][i] = self.derivada(
                        self.ativacao[iCamada][i]) * soma
                if (iCamada > 1):
                    self.calculaDelta(desejado, iNeuronio, iCamada - 1)
            else:
                self.delta[iCamada][iNeuronio] = (
                    desejado - self.ativacao[iCamada][iNeuronio]) * self.derivada(self.ativacao[iCamada][iNeuronio])
                self.calculaDelta(desejado, iNeuronio, iCamada - 1)

    def atualizaPesos(self, iNeuronio, iCamada):
        if iCamada > 0:
            for i in range(len(self.pesos[iCamada - 1])):
                for j in range(len(self.pesos[iCamada - 1][i])):
                    self.pesos[iCamada - 1][i][j] += self.txAprendizagem * \
                        self.delta[iCamada][j] * self.ativacao[iCamada - 1][i]

            self.atualizaPesos(iNeuronio, iCamada - 1)

    def feedBackward(self, desejado=0, iNeuronio=0):
        desejado = copy.copy(desejado)
        iNeuronio = copy.copy(iNeuronio)
        iCamada = copy.copy(self.iSaida)
        self.calculaDelta(desejado, iNeuronio, iCamada)
        iCamada = copy.copy(self.iSaida)
        self.atualizaPesos(iNeuronio, iCamada)

    def treina(self):
        for epoca in range(self.epocas):
            # print("Época " + str(epoca))
            for i, dado in enumerate(self.dados):
                # self.zeraListaRecursiva(self.delta)
                # self.zeraListaRecursiva(self.ativacao)
                self.ativacaoPrimeiraCamada(dado)
                self.feedForward()
                self.previsto.append(self.ativacao[self.iSaida])
                if (type(self.desejado[i]) is list):
                    if self.desejado[i] != self.ativacao[self.iSaida]:
                        for desejado in self.desejado[i]:
                            self.feedBackward(desejado, i)
                else:
                    if self.desejado[i] != self.ativacao[self.iSaida][0]:
                        self.feedBackward(self.desejado[i], 0)
            sum = 0
            for i, desej in enumerate(self.desejado):
                sum += math.pow(self.previsto[i][0] - desej, 2)

            # print(sum / len(self.dados))

    def prediz(self, dado):
        self.ativacaoPrimeiraCamada(dado)
        self.feedForward()
        return self.ativacao[self.iSaida]


mlp = MLP(
    pesos=pesos,
    dados=dados,
    desejado=desejado,
    epocas=2000
)


mlp.treina()

for dado in dados:
    print("--------", dado)
    print(mlp.prediz(dado))
