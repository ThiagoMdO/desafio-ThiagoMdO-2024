const Animal = Object.freeze({
    LEAO:       { nome: "leão", tamanho: 3, bioma: ["savana"], alimentacao: "carnivoro" },
    LEOPARDO:   { nome: "leopardo", tamanho: 2, bioma: ["savana"], alimentacao: "carnivoro" },
    CROCODILO:  { nome: "crocodilo", tamanho: 3, bioma: ["rio"], alimentacao: "carnivoro" },
    MACACO:     { nome: "macaco", tamanho: 1, bioma: ["savana", "floresta"], alimentacao: "herbivoro" },
    GAZELA:     { nome: "gazela", tamanho: 2, bioma: ["savana"], alimentacao: "herbivoro" },
    HIPOPOTAMO: { nome: "hipopotamo", tamanho: 4, bioma: ["rio", "savana"], alimentacao: "herbivoro" }
});

export default Animal;