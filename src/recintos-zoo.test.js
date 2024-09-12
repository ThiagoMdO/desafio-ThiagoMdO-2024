import { RecintosZoo } from "./recintos-zoo.js";

describe('Recintos do Zoologico', () => {

    test('Deve rejeitar animal inválido', () => {
        const resultado = new RecintosZoo().analisaRecintos('UNICORNIO', 1);
        expect(resultado.erro).toBe("Animal inválido");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve rejeitar quantidade inválida', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 0);
        expect(resultado.erro).toBe("Quantidade inválida");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve rejeitar quantidade inválida, numero negativo', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', -10);
        expect(resultado.erro).toBe("Quantidade inválida");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Não deve encontrar recintos para 10 macacos', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 10);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Não deve permitir outro animal carnivoro habitar recinto de outro animal carnivoro', () => {
        const resultado = new RecintosZoo().analisaRecintos('LEOPARDO', 3);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Não deve permitir, mesmo que com espaço suficiente no recinto 3, preencher espaço total tendo mais de uma especie no recinto, por lugar extra', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 7);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 0 total: 10)');
    });

    test('Deve encontrar recinto para 1 crocodilo', () => {
        const resultado = new RecintosZoo().analisaRecintos('CROCODILO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 4 (espaço livre: 5 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(1);
    });

    test('Deve encontrar recintos para 2 macacos', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 5 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 3 total: 5)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 2 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    test('Deve permitir colocar um macaco em apenas recintos não vazios, com bioma compatível', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 6 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 3 (espaço livre: 3 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(2);
    });

    test('Deve permitir 2 hipopotamos ocuparem todos espaços disponiveis no recinto 4', () => {
        const resultado = new RecintosZoo().analisaRecintos('HIPOPOTAMO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 4 (espaço livre: 0 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(1);
    });

    test('Deve permitir animais carnivoros apenas em lugares vazios ou da mesma espécie, com bioma campatível', () => {
        const resultado = new RecintosZoo().analisaRecintos('LEAO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 2 (espaço livre: 2 total: 5)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 5 (espaço livre: 3 total: 9)');
        expect(resultado.recintosViaveis.length).toBe(2);
    });

    test('Deve permitir a inclusão de animais herbivoros (não territoriais) no mesmo recinto, com bioma compatível, e não permir colocar onde existam carnívoros', () => {
        const resultado = new RecintosZoo().analisaRecintos('GAZELA', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 4 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 3 total: 5)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 3 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    test('Deve permitir a inclusão de animais herbivoro territorial, apenas em recinto vazio compatível, ou da mesma especie ou em bioma onde toleram outras especies', () => {
        const resultado = new RecintosZoo().analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 2 (espaço livre: 1 total: 5)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 3 (espaço livre: 0 total: 7)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 4 (espaço livre: 4 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    test('Deve reservar um espaço entra, caso tenha mais de uma especie num recinto', () => {
        const resultado = new RecintosZoo().analisaRecintos('GAZELA', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 2 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 1 total: 5)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 1 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    
    test('checkAnimalExiste_ComAnimalValido_ReturnFalse', () => {
        const resultado = new RecintosZoo().checkAnimalExiste('GAZELA');
        expect(resultado).toBeFalsy();
    });

    test('checkAnimalExiste_ComAnimalInvalido_ReturnAnimalInvalido', () => {
        const resultado = new RecintosZoo().checkAnimalExiste('AnimalInvalido');
        expect(resultado).toBe('Animal inválido');
    });

    test('checkQuantidade_ComQuantidadeCorreta_ReturnFalse', () => {
        const resultado = new RecintosZoo().checkQuantidade(1);
        expect(resultado).toBeFalsy();
    });

    test('checkQuantidade_ComQuantidadeInvalida_ReturnQuantidadeInválida', () => {
        const resultado = new RecintosZoo().checkQuantidade(-1);
        expect(resultado).toBe('Quantidade inválida');
    });

    
});

