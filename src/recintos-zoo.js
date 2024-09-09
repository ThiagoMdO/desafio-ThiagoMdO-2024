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

        this.checkAmbientes(listaAmbientes,
            listaAnimais,
            Animal[animal],
            quantidade,
            espacoDoAnimalTotal,
            espacosDisponiveis);
            
        return espacosDisponiveis;
    }

    checkAmbientes(listaAmbientes,
        listaAnimais,
        animalRequest,
        quantidade,
        espacoDoAnimalTotal,
        espacosDisponiveis
    ) {
        for (const ambiente of listaAmbientes) {
            let tamanhoAnimaisJaNoAmbiente = 0;

            //jogar dentro da função com area util para faciliar o calculo com animais que Ja tem no repository e do que
            // ta chegando se não for da mesma especie reservar um espaço a mais (caso duas especies no mesmo recindo diminuir uma vaga no recinto)
            let lugarExtra = false;

            if (this.checkComRecintoVazio(ambiente,
                                    animalRequest,
                                    quantidade,
                                    tamanhoAnimaisJaNoAmbiente,
                                    lugarExtra,
                                    espacoDoAnimalTotal,
                                    espacosDisponiveis
            )) continue;
            
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

    checkComRecintoVazio(ambiente,
        animalRequest,
        quantidade,
        tamanhoAnimaisJaNoAmbiente,
        lugarExtra,
        espacoDoAnimalTotal,
        espacosDisponiveis
    ) {
        if (ambiente.habitantes.length === 0) {

            if (this.animalComMenosDaQuantidadeMinimaEmRecinto(animalRequest,
                                                                "macaco", 
                                                                quantidade, 
                                                                2)
                )
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

            for (const animalPesquisa of listaAnimais) {

               this.checkAnimaisCompativeis(animalPesquisa,
                                        nome,
                                        tamanhoAnimaisJaNoAmbiente,
                                        quantidade,
                                        animalRequest,
                                        ambiente,
                                        lugarExtra,
                                        espacoDoAnimalTotal,
                                        espacosDisponiveis
                );
            }
        }
    }
    checkAnimaisCompativeis(animalRepository,
                            nomeAnimal,
                            tamanhoAnimaisJaNoAmbiente,
                            quantidade,
                            animalRequest,
                            ambiente,
                            lugarExtra,
                            espacoDoAnimalTotal,
                            espacosDisponiveis
    ) {
        if (animalRepository.nome === nomeAnimal) {
            tamanhoAnimaisJaNoAmbiente += animalRepository.tamanho * quantidade;
            this.filtroAnimalCarnivoro(animalRepository,
                                    "carnivoro",
                                    animalRequest,
                                    nomeAnimal,
                                    ambiente,
                                    tamanhoAnimaisJaNoAmbiente,
                                    lugarExtra,
                                    espacoDoAnimalTotal,
                                    espacosDisponiveis
            ) ;

            this.filtroAnimalNaoCarnivoro(animalRepository,
                                    "carnivoro",
                                    animalRequest,
                                    ambiente,
                                    tamanhoAnimaisJaNoAmbiente,
                                    lugarExtra,
                                    espacoDoAnimalTotal,
                                    espacosDisponiveis,
                                    ambiente
            );
        }
    }

    filtroAnimalCarnivoro(animalRepository,
        tipoCarnivoro,
        animalRequest,
        nomeAnimal,
        ambiente,
        tamanhoAnimaisJaNoAmbiente,
        lugarExtra,
        espacoDoAnimalTotal,
        espacosDisponiveis
    ) {
        if (animalRepository.alimentacao === tipoCarnivoro 
            && animalRequest.nome === nomeAnimal) {
            if (animalRequest.bioma.some(bioma => ambiente.bioma.includes(bioma))) {
                const areaUtil = ambiente.tamanhoTotal - tamanhoAnimaisJaNoAmbiente - ((lugarExtra)?1:0);
                this.adicionarRecinto(areaUtil, espacoDoAnimalTotal, espacosDisponiveis, ambiente)
            }
        }
    }

    filtroAnimalNaoCarnivoro(animalRepository,
                            tipoCarnivoro,
                            animalRequest,
                            ambiente,
                            tamanhoAnimaisJaNoAmbiente,
                            lugarExtra,
                            espacoDoAnimalTotal,
                            espacosDisponiveis

    ) {
        if (animalRepository.alimentacao !== tipoCarnivoro
            && animalRequest.alimentacao !== tipoCarnivoro) {
            if (animalRequest.bioma.some(bioma => ambiente.bioma.includes(bioma))) {
            const areaUtil = ambiente.tamanhoTotal - tamanhoAnimaisJaNoAmbiente - ((lugarExtra)?1:0);

            // verificar futuramente lista de animais territoriais
            this.checkSituacaoAnimalTerritorial(animalRequest.nome, 
                                            "hipopotamo", 
                                            animalRepository.nome, 
                                            areaUtil,
                                            espacoDoAnimalTotal,
                                            espacosDisponiveis,
                                            ambiente);
            }
        }
    }

    checkSituacaoAnimalTerritorial(animalRequest, 
                                animalTerritorial, 
                                animalRepository, 
                                areaUtil,
                                espacoDoAnimalTotal,
                                espacosDisponiveis,
                                ambiente
    ) {

        this.checkAnimalTerritorialEntraEspacoMesmaEspecie(animalRequest, 
                                                        animalTerritorial,
                                                        animalRepository,
                                                        areaUtil,
                                                        espacoDoAnimalTotal, 
                                                        espacosDisponiveis,
                                                        ambiente
        )

        this.checkAnimalTerritorialEntraEspacoAnimalNaoTerritorial(animalRequest, 
                                                                animalTerritorial,
                                                                animalRepository,
                                                                ambiente,
                                                                areaUtil,
                                                                espacoDoAnimalTotal, 
                                                                espacosDisponiveis
        );

        this.checkSemAnimalTerritorial(animalRequest, 
            animalTerritorial, 
            animalRepository, 
            areaUtil, 
            espacoDoAnimalTotal, 
            espacosDisponiveis, 
            ambiente
        );
    }

    checkAnimalTerritorialEntraEspacoMesmaEspecie(animalRequest, 
        animalTerritorial,
        animalRepository,
        areaUtil,
        espacoDoAnimalTotal, 
        espacosDisponiveis,
        ambiente
    ) {
        if (animalRequest ===  animalTerritorial 
            && animalRepository ===  animalTerritorial){
                this.adicionarRecinto(areaUtil, espacoDoAnimalTotal, espacosDisponiveis, ambiente)
        }
    }

    checkAnimalTerritorialEntraEspacoAnimalNaoTerritorial(
        animalRequest, 
        animalTerritorial,
        animalRepository,
        ambiente,
        areaUtil,
        espacoDoAnimalTotal, 
        espacosDisponiveis
    ) {
        const biomaNecessario = ["savana", "rio"];
        if (animalRequest !== animalTerritorial
            && animalRepository === animalTerritorial
            && biomaNecessario.every(bioma => ambiente.bioma.includes(bioma))
        ) {
            this.adicionarRecinto(areaUtil, espacoDoAnimalTotal, espacosDisponiveis, ambiente)
        }
    }

    checkSemAnimalTerritorial(animalRequest, 
                            animalTerritorial, 
                            animalRepository, 
                            areaUtil, 
                            espacoDoAnimalTotal, 
                            espacosDisponiveis, 
                            ambiente
    ) {
        if (animalRequest !== animalTerritorial 
            && animalRepository !== animalTerritorial) {
            this.adicionarRecinto(areaUtil, espacoDoAnimalTotal, espacosDisponiveis, ambiente)    
        }
    }

    adicionarRecinto(areaUtil, espacoDoAnimalTotal, espacosDisponiveis, ambiente) {
        if (areaUtil >= espacoDoAnimalTotal ) {
            espacosDisponiveis.push(`Recinto ${ambiente.recinto} `
                +`(espaço livre: ${areaUtil - espacoDoAnimalTotal} total: ${ambiente.tamanhoTotal})`)
        } else {
            return "Não há recinto viável";
        }
    }
}

export { RecintosZoo as RecintosZoo };