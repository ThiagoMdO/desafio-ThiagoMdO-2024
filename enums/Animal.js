const Animal = Object.freeze({
    LEAO:       { nome: "leão", tamanho: 3, bioma: ["savana"] },
    LEOPARDO:   { nome: "leopardo", tamanho: 2, bioma: ["savana"] },
    CROCODILO:  { nome: "crocodilo", tamanho: 3, bioma: ["rio"] },
    MACACO:     { nome: "macaco", tamanho: 1, bioma: ["savana", "floresta"] },
    GAZELA:     { nome: "gazela", tamanho: 2, bioma: ["savana"] },
    HIPOPOTAMO: { nome: "hipopotamo", tamanho: 4, bioma: ["rio", "savana"] }
});

export default Animal;