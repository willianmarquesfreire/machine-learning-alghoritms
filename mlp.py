import copy
import math

dados = [
    [0, 1, 1]
]

desejado = [[1, 0]]

pesos = [
    [[-1, 0], [0, 1], [1, 1]],
    [[1, -1], [0, 1], [1, 1]],
    [0, 0]
]


class MLP:
    def __init__(self, txAprendizagem=0.1, pesos=None, dados=None, epocas=1, desejado=None, momento=0.2):
        self.txAprendizagem = txAprendizagem
        self.pesos = pesos
        self.ativacao = self.zeraLista(copy.deepcopy(pesos))
        self.delta = self.zeraLista(copy.deepcopy(pesos))
        self.dados = copy.deepcopy(dados)
        self.iSaida = len(self.pesos) - 1
        self.epocas = epocas
        self.momento = momento
        self.desejado = desejado
        self.previsto = []

    def zeraLista(self, lista):
        for i in range(len(lista)):
            for j in range(len(lista[i])):
                lista[i][j] = 0
        return lista

    def zeraListaRecursiva(self, lista, valor=0):
        for i in range(len(lista)):
            if type(lista[i]) is list:
                self.zeraListaRecursiva(lista[i])
            else:
                lista[i] = valor
        return lista

    def multiplicacaoRecursiva(self, lista, valor):
        for i in range(len(lista)):
            if type(lista[i]) is list:
                self.zeraListaRecursiva(lista[i])
            else:
                lista[i] *= valor
        return lista

    def sigmoid(self, valor):
        return valor
        # return 1 / (1 + math.pow(math.e, -valor))

    def derivada(self, valor):
        return valor
        # return valor * (1 - valor)

    def multiplicacao(self, original, ativacao, pesos):
        vetor = self.zeraListaRecursiva(copy.deepcopy(original))
        for i, p in enumerate(pesos):
            for j in vetor:
                try:
                    vetor[j] += p[j] * ativacao[i]
                except:
                    vetor[j] = 1
                

        print(vetor)
        return [self.sigmoid(v) for v in vetor]

    def feedForward(self, dado):
        for i in range(len(self.ativacao)):
            if i != 0:
                self.ativacao[i] = self.multiplicacao(self.ativacao[i], self.ativacao[i-1], self.pesos[i-1])

    def calculaDelta(self, dado, desejado):
        iCamadas = self.iSaida
        for iCamada in reversed(range(iCamadas + 1)):
            for iNeuronio in range(len(self.delta[iCamada])):
                if iCamada == self.iSaida:
                    self.delta[iCamada][iNeuronio] = (
                        desejado[iNeuronio] - self.ativacao[iCamada][iNeuronio]) * self.derivada(self.ativacao[iCamada][iNeuronio])
                elif iCamada > 0:
                    soma = 0
                    for iNeuronioNext, neuronioNext in enumerate(self.delta[iCamada+1]):
                        soma += neuronioNext * \
                            self.pesos[iCamada][iNeuronio][iNeuronioNext]
                    self.delta[iCamada][iNeuronio] = self.derivada(
                        self.ativacao[iCamada][iNeuronio]) * soma
                    # print(self.delta[iCamada][iNeuronio])

    def ajustaPesos(self, dado, desejado):
        # print(self.delta)
        for iCamada in range(self.iSaida):
            for i in range(len(self.ativacao[iCamada])):
                for j in range(len(self.pesos[iCamada][i])):
                    self.pesos[iCamada][i][j] += self.txAprendizagem * \
                        self.delta[iCamada][i] * self.ativacao[iCamada+1][j]

        print("ajusta pesos")

    def feedBackward(self, dado, desejado):
        self.calculaDelta(dado, desejado)
        self.ajustaPesos(dado, desejado)

    def treina(self):
        for epoca in range(self.epocas):
            # print("Época " + str(epoca))
            self.zeraListaRecursiva(self.ativacao)
            self.zeraListaRecursiva(self.delta)
            for i, dado in enumerate(self.dados):
                for id, d in enumerate(dado):
                    self.ativacao[0][id] = d
                self.feedForward(dado)
                desejado = ([self.desejado[i]], self.desejado[i])[
                    type(self.desejado[i]) is list]
                if desejado != self.ativacao[self.iSaida]:
                    self.feedBackward(dado, desejado)

    def prediz(self, dado):
        self.zeraListaRecursiva(self.ativacao)
        self.zeraListaRecursiva(self.delta)
        self.ativacao[0] = dado
        self.feedForward(dado)
        return self.ativacao[self.iSaida]


mlp = MLP(
    pesos=pesos,
    dados=dados,
    desejado=desejado,
    epocas=1
)

mlp.treina()

for dado in dados:
    print("--------", dado)
    print(mlp.prediz(dado))
