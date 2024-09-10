import Animal from "../data/Animal.js";
import Ambiente from "../data/Ambiente.js";

import AnimalToCheckCompativelDTO from "./dto/AnimalToCheckCompativelDTO.js";

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
    }

    checkQuantidade(quantidade) {
        if (quantidade < 1) return "Quantidade inválida";
    }

    checkRecintoSituacao(animal, quantidade) {
        const listaAmbientes = Object.values(Ambiente);
        const listaAnimais = Object.values(Animal);

        const espacoDoAnimalTotal =  Animal[animal].tamanho * quantidade;
        let espacosDisponiveis = [];

        this.checkAmbientes(listaAmbientes,
            listaAnimais,
            Animal[animal],
            quantidade,
            espacoDoAnimalTotal,
            espacosDisponiveis);

        if (espacosDisponiveis.length === 0) return false;
        return espacosDisponiveis;
    }

    checkAmbientes(
        listaAmbientes,
        listaAnimais,
        animalRequest,
        quantidade,
        espacoDoAnimalTotal,
        espacosDisponiveis
    ) {
        for (const ambiente of listaAmbientes) {
            let tamanhoAnimaisJaNoAmbiente = 0;
            let lugarExtra = false;

            this.adicionaAnimalNaoSolitarioSeNaoTiverSozinho(ambiente,
                animalRequest,
                quantidade,
                tamanhoAnimaisJaNoAmbiente,
                lugarExtra,
                espacoDoAnimalTotal,
                espacosDisponiveis
            );
            
            if (ambiente.habitantes.length > 1) lugarExtra = true;

            //bolar um jeito de se já tiver mais de uma especie no recinto, (chave, valor) sobrescrever posição atualizada
            // talvez colocar uma variavel pra ter esses dois valores ja atualizado, fora do looping e sobrescreve a informação na variavel 
            // : variavel = nova info, no looping
            // colocar logica fora do ambiente para interar a quantidade de animais primeiro?
            
            this.checkAnimaisEmCadaAmbiente(ambiente,
                listaAnimais,
                tamanhoAnimaisJaNoAmbiente,
                animalRequest,
                lugarExtra,
                espacoDoAnimalTotal,
                espacosDisponiveis
            )
        }
    }

    adicionaAnimalNaoSolitarioSeNaoTiverSozinho(ambiente,
        animalRequest,
        quantidade,
        tamanhoAnimaisJaNoAmbiente,
        lugarExtra,
        espacoDoAnimalTotal,
        espacosDisponiveis
    ) {
        if (ambiente.habitantes.length === 0) {

            if (this.animalComMenosDaQuantidadeMinimaEmRecinto(animalRequest, "macaco", quantidade, 2))
                return true;
            
            if (animalRequest.bioma.some(bioma => ambiente.bioma.includes(bioma))) {
                const areaUtil = ambiente.tamanhoTotal - tamanhoAnimaisJaNoAmbiente - ((lugarExtra)?1:0);
                this.adicionarRecinto(areaUtil, espacoDoAnimalTotal, espacosDisponiveis, ambiente)
            }
        }
    }

    animalComMenosDaQuantidadeMinimaEmRecinto(animalRequest, nomeAnimal, quantidade, quantidadeMinima) {
        if (animalRequest.nome === nomeAnimal && quantidade < quantidadeMinima) return true;
    }

    checkAnimaisEmCadaAmbiente(ambiente,
        listaAnimais,
        tamanhoAnimaisJaNoAmbiente,
        animalRequest,
        lugarExtra,
        espacoDoAnimalTotal,
        espacosDisponiveis
    ) {
        for (const habitantes of ambiente.habitantes) {
            const [nome, quantidade] = habitantes.split(',');

            if (ambiente.habitantes.length > 0 && animalRequest.nome !== nome) lugarExtra = true;

            for (const animalPesquisa of listaAnimais) {

               this.checkAnimaisCompativeis( new AnimalToCheckCompativelDTO(animalPesquisa,
                    nome,
                    tamanhoAnimaisJaNoAmbiente,
                    quantidade,
                    animalRequest,
                    ambiente,
                    lugarExtra,
                    espacoDoAnimalTotal,
                    espacosDisponiveis
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
            if (animalToCheckCompativelDTO.animalRequest.bioma
                .some(bioma => animalToCheckCompativelDTO.ambiente.bioma.includes(bioma))) {

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
            if (animalToCheckCompativelDTO.animalRequest.bioma
                .some(bioma => animalToCheckCompativelDTO.ambiente.bioma.includes(bioma))) 
            {
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

        this.checkAnimalTerritorialEntraEspacoMesmaEspecie(animalToCheckCompativelDTO)

        this.checkAnimalTerritorialEntraEspacoAnimalNaoTerritorial(animalToCheckCompativelDTO);

        this.checkAnimalNaoTerritorialEntraEspacoDeAnimalTerritorial(animalToCheckCompativelDTO);

        this.checkSemAnimalTerritorial(animalToCheckCompativelDTO);
    }

    checkAnimalTerritorialEntraEspacoMesmaEspecie(animalToCheckCompativelDTO) {
        if (animalToCheckCompativelDTO.animalRequest ===  animalToCheckCompativelDTO.animalTerritorial 
            && animalToCheckCompativelDTO.animalRepository ===  animalToCheckCompativelDTO.animalTerritorial){
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
        if (animalToCheckCompativelDTO.animalRequest !== animalToCheckCompativelDTO.animalTerritorial
            && animalToCheckCompativelDTO.animalRepository === animalToCheckCompativelDTO.animalTerritorial
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