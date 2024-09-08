import Animal from "../data/Animal.js";
import Ambiente from "../data/Ambiente.js";

class RecintosZoo {

    analisaRecintos(animal, quantidade) {

        const aninalNaoExiste = this.checkAnimalExiste(animal);
        if (aninalNaoExiste) return aninalNaoExiste;

        const quantidadeInvalida = this.checkQuantidade(quantidade);
        if (quantidadeInvalida) return quantidadeInvalida;

        const recintoCheio = this.checkRecintoCheio(animal, quantidade);
        if (recintoCheio) return recintoCheio;

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

        const espacoDoAnimalTotal =  Animal[animal].tamanho * quantidade;
        let espacosDisponiveis = [];

        for (const ambiente of listaAmbientes) {
            let tamanhoAnimaisJaNoAmbiente = 0;
            let lugarExtra = false;

            if (ambiente.habitantes.length === 0) {
                if (Animal[animal].nome === "macaco" && quantidade < 2) continue;
                
                if (Animal[animal].bioma.some(bioma => ambiente.bioma.includes(bioma))) {
                    const areaUtil = ambiente.tamanhoTotal - tamanhoAnimaisJaNoAmbiente - ((lugarExtra)?1:0);
    
                    if (areaUtil >= espacoDoAnimalTotal) {
                        espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
                            +`(espaço livre: ${areaUtil - espacoDoAnimalTotal} total: ${ambiente.tamanhoTotal})`)
                    } else {
                        return "Não há recinto viável";
                    }
                }
                continue;
            }
            
            if (ambiente.habitantes.length > 1) lugarExtra = true;

            for (const habitantes of ambiente.habitantes) {
                const [nome, quantidade] = habitantes.split(',');

                for (const animalPesquisa of listaAnimais) {
                    if (animalPesquisa.nome === nome) {
                        tamanhoAnimaisJaNoAmbiente += animalPesquisa.tamanho * quantidade;
                        // verificar se quem ta la dentro é carnivoro, permitir só da mesma especie
                        if (animalPesquisa.alimentacao === "carnivoro" 
                            && Animal[animal].nome === nome) {
                            if (Animal[animal].bioma.some(bioma => ambiente.bioma.includes(bioma))) {
                                const areaUtil = ambiente.tamanhoTotal - tamanhoAnimaisJaNoAmbiente - ((lugarExtra)?1:0);
                
                                if (areaUtil >= espacoDoAnimalTotal) {
                                    espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
                                        +`(espaço livre: ${areaUtil - espacoDoAnimalTotal} total: ${ambiente.tamanhoTotal})`)
                                } else {
                                    return "Não há recinto viável";
                                }
                            }
                        }

                        // verificar se quem ta la dentro e quem ta entrando não são carnivoro, permitir outras especies
                        if (animalPesquisa.alimentacao !== "carnivoro"
                            && Animal[animal].alimentacao !== "carnivoro") {
                            if (Animal[animal].bioma.some(bioma => ambiente.bioma.includes(bioma))) {
                                const areaUtil = ambiente.tamanhoTotal - tamanhoAnimaisJaNoAmbiente - ((lugarExtra)?1:0);

                                if (Animal[animal].nome === "hipopotamo" 
                                    && animalPesquisa.nome === "hipopotamo"){
                                        if (areaUtil >= espacoDoAnimalTotal) {
                                            espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
                                                +`(espaço livre: ${areaUtil - espacoDoAnimalTotal} total: ${ambiente.tamanhoTotal})`)
                                        }

                                        //verificar se for hipopotamo e tiver em savana com rio
                                        const biomaNecessario = ["savana", "rio"];
                                        if (!biomaNecessario.every(bioma => ambiente.bioma.includes(bioma)))
                                            continue;
                                        
                                }

                                const biomaNecessario = ["savana", "rio"];
                                if (Animal[animal].nome !== "hipopotamo"
                                    && animalPesquisa.nome === "hipopotamo"
                                    && biomaNecessario.every(bioma => ambiente.bioma.includes(bioma))
                                ) {
                                    if (areaUtil >= espacoDoAnimalTotal ) {
                                        espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
                                            +`(espaço livre: ${areaUtil - espacoDoAnimalTotal} total: ${ambiente.tamanhoTotal})`)
                                    } else {
                                        return "Não há recinto viável";
                                    }
                                    continue;
                                }

                                if (Animal[animal].nome !== "hipopotamo"
                                    && animalPesquisa.nome !== "hipopotamo"){
                                    if (areaUtil >= espacoDoAnimalTotal ) {
                                        espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
                                            +`(espaço livre: ${areaUtil - espacoDoAnimalTotal} total: ${ambiente.tamanhoTotal})`)
                                    } else {
                                        return "Não há recinto viável";
                                    }
                                }
                                
                            }
                        }
                    }
                }
            }
        }
        return espacosDisponiveis;
    }

    // adicionarRecinto(areaUtil, espacoDoAnimalTotal) {
    //     if (areaUtil >= espacoDoAnimalTotal ) {
    //         espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
    //             +`(espaço livre: ${areaUtil - espacoDoAnimalTotal} total: ${ambiente.tamanhoTotal})`)
    //     }
    // }
}

export { RecintosZoo as RecintosZoo };