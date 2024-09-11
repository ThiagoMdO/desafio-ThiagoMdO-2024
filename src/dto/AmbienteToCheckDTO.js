class AmbienteToCheckDTO {

    constructor(listaAmbientes,
        listaAnimais,
        animalRequest,
        quantidade,
        espacoDoAnimalTotal,
        espacosDisponiveis
    ) {
        this.listaAmbientes = listaAmbientes;
        this.listaAnimais = listaAnimais;
        this.animalRequest = animalRequest;
        this.quantidade = quantidade;
        this.espacoDoAnimalTotal = espacoDoAnimalTotal;
        this.espacosDisponiveis = espacosDisponiveis
    }

    setTamanhoAnimaisJaNoAmbiente(tamanhoAnimaisJaNoAmbiente) {
        this.tamanhoAnimaisJaNoAmbiente = tamanhoAnimaisJaNoAmbiente
    }

    setLugarExtra(lugarExtra) {
        this.lugarExtra = lugarExtra;
    }
    
}

export default AmbienteToCheckDTO;