import Animal from "../data/Animal.js";
import Ambiente from "../data/Ambiente.js";

import AnimalToCheckCompativelDTO from "./dto/AnimalToCheckCompativelDTO.js";
import AmbienteToCheckDTO from "./dto/AmbienteToCheckDTO.js";

class RecintosZoo {

    analisaRecintos(animal, quantidade) {

        const aninalNaoExiste = this.checkAnimalExiste(animal);
        if (aninalNaoExiste) return {erro: aninalNaoExiste};

        const quantidadeInvalida = this.checkQuantidade(quantidade);
        if (quantidadeInvalida) return {erro: quantidadeInvalida};

        const achouLugar = this.checkRecintoSituacao(animal, quantidade);
        if (achouLugar) return { erro: null, recintosViaveis: achouLugar };

        return { erro: "Não há recinto viável", recintosViaveis: achouLugar };
    }

    checkAnimalExiste(animal) {
        const animaisValidos = Object.keys(Animal);
        if (!animaisValidos.includes(animal)) return "Animal inválido";
        return false;
    }

    checkQuantidade(quantidade) {
        if (quantidade < 1) return "Quantidade inválida";
        return false;
    }

    checkRecintoSituacao(animal, quantidade) {
        const listaAmbientes = Object.values(Ambiente);
        const listaAnimais = Object.values(Animal);

        const espacoDoAnimalTotal =  Animal[animal].tamanho * quantidade;
        let espacosDisponiveis = [];

        this.checkAmbientes( new AmbienteToCheckDTO(
            listaAmbientes,
            listaAnimais,
            Animal[animal],
            quantidade,
            espacoDoAnimalTotal,
            espacosDisponiveis)
        );

        if (espacosDisponiveis.length === 0) return false;
        return espacosDisponiveis;
    }

    checkAmbientes(ambienteToCheckDTO) {
        for (const ambiente of ambienteToCheckDTO.listaAmbientes) {
            let tamanhoAnimaisJaNoAmbiente = 0;
            let lugarExtra = false;

            ambienteToCheckDTO.setTamanhoAnimaisJaNoAmbiente(tamanhoAnimaisJaNoAmbiente);
            ambienteToCheckDTO.setLugarExtra(lugarExtra);

            this.adicionaAnimalSeRecintoVazioECompativel(ambiente, ambienteToCheckDTO);
            
            if (ambiente.habitantes.length > 1) lugarExtra = true;

            this.checkAnimaisEmCadaAmbiente(ambiente, ambienteToCheckDTO);
        }
    }

    adicionaAnimalSeRecintoVazioECompativel(ambiente, ambienteToCheckDTO) {
        if (ambiente.habitantes.length === 0) {

            if (this.animalComMenosDaQuantidadeMinimaEmRecinto(
                ambienteToCheckDTO.animalRequest, 
                "macaco", 
                ambienteToCheckDTO.quantidade, 
                2))
                return;
            
            let ambienteCompativel = ambienteToCheckDTO.animalRequest.bioma
            .some(bioma => ambiente.bioma.includes(bioma));

            if (ambienteCompativel) {
                const areaUtil = ambiente.tamanhoTotal 
                - ambienteToCheckDTO.tamanhoAnimaisJaNoAmbiente 
                - ((ambienteToCheckDTO.lugarExtra)?1:0);
                this.adicionarRecinto(
                    areaUtil, 
                    ambienteToCheckDTO.espacoDoAnimalTotal, 
                    ambienteToCheckDTO.espacosDisponiveis, 
                    ambiente)
            }
        }
    }

    animalComMenosDaQuantidadeMinimaEmRecinto(animalRequest, nomeAnimal, quantidade, quantidadeMinima) {
        if (animalRequest.nome === nomeAnimal && quantidade < quantidadeMinima) return true;
    }

    checkAnimaisEmCadaAmbiente(ambiente, ambienteToCheckDTO) {
        for (const habitantes of ambiente.habitantes) {
            const [nome, quantidade] = habitantes.split(',');

            if (ambiente.habitantes.length > 0 && ambienteToCheckDTO.animalRequest.nome !== nome) 
                ambienteToCheckDTO.lugarExtra = true;

            for (const animalPesquisa of ambienteToCheckDTO.listaAnimais) {

               this.checkAnimaisCompativeis( new AnimalToCheckCompativelDTO(animalPesquisa,
                    nome,
                    ambienteToCheckDTO.tamanhoAnimaisJaNoAmbiente,
                    quantidade,
                    ambienteToCheckDTO.animalRequest,
                    ambiente,
                    ambienteToCheckDTO.lugarExtra,
                    ambienteToCheckDTO.espacoDoAnimalTotal,
                    ambienteToCheckDTO.espacosDisponiveis
                ));
            }
        }
    }
    checkAnimaisCompativeis(animalToCheckCompativelDTO) {
        if (animalToCheckCompativelDTO.animalRepository.nome === animalToCheckCompativelDTO.nomeAnimal) {
            animalToCheckCompativelDTO.tamanhoAnimaisJaNoAmbiente 
            += animalToCheckCompativelDTO.animalRepository.tamanho 
            * animalToCheckCompativelDTO.quantidade;

            this.filtroAnimalCarnivoro(animalToCheckCompativelDTO) ;

            this.filtroAnimalNaoCarnivoro(animalToCheckCompativelDTO);
        }
    }

    filtroAnimalCarnivoro(animalToCheckCompativelDTO) {
        if (animalToCheckCompativelDTO.animalRepository.alimentacao === "carnivoro" 
            && animalToCheckCompativelDTO.animalRequest.nome === animalToCheckCompativelDTO.nomeAnimal) {
            
            let ambienteCompativel = animalToCheckCompativelDTO.animalRequest.bioma
            .some(bioma => animalToCheckCompativelDTO.ambiente.bioma.includes(bioma));

            if (ambienteCompativel) {
                const areaUtil = animalToCheckCompativelDTO.ambiente.tamanhoTotal 
                - animalToCheckCompativelDTO.tamanhoAnimaisJaNoAmbiente 
                - ((animalToCheckCompativelDTO.lugarExtra)?1:0);

                this.adicionarRecinto(
                    areaUtil, 
                    animalToCheckCompativelDTO.espacoDoAnimalTotal, 
                    animalToCheckCompativelDTO.espacosDisponiveis, 
                    animalToCheckCompativelDTO.ambiente
                )
            }
        }
    }

    filtroAnimalNaoCarnivoro(animalToCheckCompativelDTO) {
        if (animalToCheckCompativelDTO.animalRepository.alimentacao !== "carnivoro"
            && animalToCheckCompativelDTO.animalRequest.alimentacao !== "carnivoro") {

            let ambienteCompativel = animalToCheckCompativelDTO.animalRequest.bioma
            .some(bioma => animalToCheckCompativelDTO.ambiente.bioma.includes(bioma));

            if (ambienteCompativel) {
                const areaUtil = animalToCheckCompativelDTO.ambiente.tamanhoTotal 
                - animalToCheckCompativelDTO.tamanhoAnimaisJaNoAmbiente 
                - ((animalToCheckCompativelDTO.lugarExtra)?1:0);

                animalToCheckCompativelDTO.setAnimalTerritorial("hipopotamo");
                animalToCheckCompativelDTO.setAreaUtil(areaUtil);

                this.checkSituacaoAnimalTerritorial(animalToCheckCompativelDTO);
            }
        }
    }

    checkSituacaoAnimalTerritorial(animalToCheckCompativelDTO) {
        this.checkSemAnimalTerritorial(animalToCheckCompativelDTO);

        this.checkAnimalTerritorialEntraEspacoMesmaEspecie(animalToCheckCompativelDTO)

        this.checkAnimalTerritorialEntraEspacoAnimalNaoTerritorial(animalToCheckCompativelDTO);

        this.checkAnimalNaoTerritorialEntraEspacoDeAnimalTerritorial(animalToCheckCompativelDTO);

    }

    checkAnimalTerritorialEntraEspacoMesmaEspecie(animalToCheckCompativelDTO) {
        if (animalToCheckCompativelDTO.animalRequest.nome ===  animalToCheckCompativelDTO.animalTerritorial 
            && animalToCheckCompativelDTO.animalRepository.nome ===  animalToCheckCompativelDTO.animalTerritorial){
                this.adicionarRecinto(
                    animalToCheckCompativelDTO.areaUtil, 
                    animalToCheckCompativelDTO.espacoDoAnimalTotal, 
                    animalToCheckCompativelDTO.espacosDisponiveis, 
                    animalToCheckCompativelDTO.ambiente
                )
        }
    }

    checkAnimalNaoTerritorialEntraEspacoDeAnimalTerritorial(animalToCheckCompativelDTO) {
        const biomaNecessario = ["savana", "rio"];
        if (animalToCheckCompativelDTO.animalRequest.nome !== animalToCheckCompativelDTO.animalTerritorial
            && animalToCheckCompativelDTO.animalRepository.nome === animalToCheckCompativelDTO.animalTerritorial
            && biomaNecessario.every(bioma => animalToCheckCompativelDTO.ambiente.bioma.includes(bioma))
        ) {
            this.adicionarRecinto(
                animalToCheckCompativelDTO.areaUtil, 
                animalToCheckCompativelDTO.espacoDoAnimalTotal, 
                animalToCheckCompativelDTO.espacosDisponiveis, 
                animalToCheckCompativelDTO.ambiente
            )
        }
    }

    checkAnimalTerritorialEntraEspacoAnimalNaoTerritorial(animalToCheckCompativelDTO) {
        const biomaNecessario = ["savana", "rio"];
        if (animalToCheckCompativelDTO.animalRequest.nome === animalToCheckCompativelDTO.animalTerritorial
            && animalToCheckCompativelDTO.animalRepository.nome !== animalToCheckCompativelDTO.animalTerritorial
            && biomaNecessario.every(bioma => animalToCheckCompativelDTO.ambiente.bioma.includes(bioma))
        ) {
            this.adicionarRecinto(
                animalToCheckCompativelDTO.areaUtil, 
                animalToCheckCompativelDTO.espacoDoAnimalTotal, 
                animalToCheckCompativelDTO.espacosDisponiveis, 
                animalToCheckCompativelDTO.ambiente
            )
        }
    }

    checkSemAnimalTerritorial(animalToCheckCompativelDTO) {
        if (animalToCheckCompativelDTO.animalRequest.nome !== animalToCheckCompativelDTO.animalTerritorial 
            && animalToCheckCompativelDTO.animalRepository.nome !== animalToCheckCompativelDTO.animalTerritorial) {
            this.adicionarRecinto(
                animalToCheckCompativelDTO.areaUtil, 
                animalToCheckCompativelDTO.espacoDoAnimalTotal, 
                animalToCheckCompativelDTO.espacosDisponiveis, 
                animalToCheckCompativelDTO.ambiente
            )    
        }
    }

    adicionarRecinto(areaUtil, espacoDoAnimalTotal, espacosDisponiveis, ambiente) {
        if (areaUtil < espacoDoAnimalTotal ) return "Não há recinto viável";
        
        espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
            +`(espaço livre: ${areaUtil - espacoDoAnimalTotal} total: ${ambiente.tamanhoTotal})`)
    }
}

export { RecintosZoo as RecintosZoo };