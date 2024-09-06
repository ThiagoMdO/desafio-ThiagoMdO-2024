import Animal from "../enums/Animal.js";
import Ambiente from "../enums/Ambiente.js";

class RecintosZoo {

    analisaRecintos(animal, quantidade) {

        const aninalNaoExiste = this.checkAnimalExiste(animal);
        if (aninalNaoExiste) return { erro: aninalNaoExiste, recintosViaveis: null };;

        const quantidadeInvalida = this.checkQuantidade(quantidade);
        if (quantidadeInvalida) return { erro: quantidadeInvalida, recintosViaveis: null };

        const recintoCheio = this.checkRecintoCheio(animal, quantidade);
        if (recintoCheio) return { erro: "Não há recinto viável", recintosViaveis: null };

        return { erro: null, recintosViaveis: recintoCheio };
    }

    checkAnimalExiste(animal) {
        const animaisValidos = Object.keys(Animal);
        if (!animaisValidos.includes(animal)) return "Animal inválido";
    }

    checkQuantidade(quantidade) {
        if (quantidade < 1) return "Quantidade inválida";
    }

    checkRecintoCheio(animal, quantidade) {
        const listaAmbientes = Object.values(Ambiente);
        const listaAnimais = Object.values(Animal);

        const espacoDoAnimal =  Animal[animal].tamanho * quantidade;
        let espacosDisponiveis = [];

        for (const ambiente of listaAmbientes) {
            let tamanhoAnimaisPorAmbiente = 0;

            for (const habitantes of ambiente.habitantes) {
                const [nome, quantidade] = habitantes.split(',');

                for (const animalPesquisa of listaAnimais) {
                    if (animalPesquisa.nome == nome) {
                        tamanhoAnimaisPorAmbiente += animalPesquisa.tamanho * quantidade;
                    }
                }
            }
            if (Animal[animal].bioma.some(bioma => ambiente.bioma.includes(bioma))) {
                areaUtil = ambiente.tamanhoTotal - tamanhoAnimaisPorAmbiente;

                if (areaUtil >= espacoDoAnimal) {
                    espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
                        +`(espaço livre: ${areaUtil - espacoDoAnimal} total: ${ambiente.tamanhoTotal})`)
                }
            }
        }
        return espacosDisponiveis;
    }
}

export { RecintosZoo as RecintosZoo };
