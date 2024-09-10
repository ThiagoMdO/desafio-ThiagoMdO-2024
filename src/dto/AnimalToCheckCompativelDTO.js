class AnimalToCheckCompativelDTO {
    constructor(animalRepository,
        nomeAnimal,
        tamanhoAnimaisJaNoAmbiente,
        quantidade,
        animalRequest,
        ambiente,
        lugarExtra,
        espacoDoAnimalTotal,
        espacosDisponiveis,

        animalTerritorial,
        areaUtil

    ) {
        this.animalRepository = animalRepository;
        this.nomeAnimal = nomeAnimal;
        this.tamanhoAnimaisJaNoAmbiente = tamanhoAnimaisJaNoAmbiente;
        this.quantidade = quantidade;
        this.animalRequest = animalRequest;
        this.ambiente = ambiente;
        this.lugarExtra = lugarExtra;
        this.espacoDoAnimalTotal = espacoDoAnimalTotal;
        this.espacosDisponiveis = espacosDisponiveis

        this.animalTerritorial = animalTerritorial;
        this.areaUtil = areaUtil;
    }

    setAnimalTerritorial(animalTerritorial){
        this.animalTerritorial = animalTerritorial;
    }

    setAreaUtil(areaUtil){
        this.areaUtil = areaUtil;
    }
}

export default AnimalToCheckCompativelDTO;