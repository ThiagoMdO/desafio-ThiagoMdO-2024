# RECINTOS DO ZOO

<h1 align="center" style="text-align: center; background-color: #000; border-radius: 10px">  
    <img src = "https://github.com/user-attachments/assets/0e317d85-52fe-42fe-80aa-f3d9ab4897d6" style="margin-top: 10px; height: 300px; width: 300px ">
    <p style="text-shadow : 1px 1px 10px orange">Desafio de Código DB</p>
</h1>

> ### Foi proposto um desafio de Código pela DB Server, onde a aplicação é responsável por analisar e mostrar quais recintos estão disponíveis para novos animais que entram no zoológico.


## 01 - DESCRIÇÃO DO DESAFIO
Olá! Você foi contratado para ajudar na organização de um zoológico.
Sua missão será construir a lógica para indicar os recintos onde novos animais se sintam confortáveis.

### RECINTOS EXISTENTES

 O zoológico possui os seguintes recintos disponíveis.

  | número    | bioma             | tamanho total |  animais existentes |
  |-----------|-------------------|---------------|---------------------|
  | 1         | savana            |   10          |   3 macacos         |
  | 2         | floresta          |    5          |   vazio             |
  | 3         | savana e rio      |    7          |  1 gazela           |
  | 4         | rio               |    8          |   vazio             |
  | 5         | savana            |    9          |  1 leão             |

### ANIMAIS

 O zoológico só está habilitado a tratar dos animais abaixo.
 A tabela mostra o espaço que cada indivíduo ocupa e em quais biomas se adapta.

  | espécie    | tamanho | bioma                |
  |------------|---------|----------------------|
  | LEAO       |   3     |  savana              |
  | LEOPARDO   |   2     |  savana              |
  | CROCODILO  |   3     |  rio                 |
  | MACACO     |   1     |  savana ou floresta  |
  | GAZELA     |   2     |  savana              |
  | HIPOPOTAMO |   4     |  savana ou rio       |

### REGRAS PARA ENCONTRAR UM RECINTO

1) Um animal se sente confortável se está num bioma adequado e com espaço suficiente para cada indivíduo
2) Animais carnívoros devem habitar somente com a própria espécie
3) Animais já presentes no recinto devem continuar confortáveis com a inclusão do(s) novo(s)
4) Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
5) Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
6) Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
7) Não é possível separar os lotes de animais nem trocar os animais que já existem de recinto (eles são muito apegados!).
Por exemplo, se chegar um lote de 12 macacos, não é possível colocar 6 em 2 recintos.

### ENTRADAS E SAÍDAS

1) O programa deve receber tipo e quantidade de animal (nessa ordem)
2) O programa deve retornar uma estrutura contendo a lista de todos os recintos viáveis ordenada pelo número do recinto (caso existam) e a mensagem de erro (caso exista)
3) A lista de recintos viáveis deve indicar o espaço livre que restaria após a inclusão do(s) animal(is) e o espaço total, no formato "Recinto nro (espaço livre: valorlivre total: valortotal)"
4) Caso animal informado seja inválido, apresentar erro "Animal inválido"
5) Caso quantidade informada seja inválida, apresentar erro "Quantidade inválida"
6) Caso não haja recinto possível, apresentar erro "Não há recinto viável"

### EXEMPLOS

Entrada para um caso válido
```js
"MACACO", 2
```
Saída
```js
{
  recintosViaveis: ["Recinto 1 (espaço livre: 5 total: 10)", 
   "Recinto 2 (espaço livre: 3 total: 5)", 
   "Recinto 3 (espaço livre: 2 total: 7)"]
}
```

Entrada para um caso inválido
```js
"UNICORNIO", 1
```
Saída
```js
{
  erro: "Animal inválido"
}
```
### 🗂️Hierarquida das pastas

```bash
  target
    └── data
        ├── Ambiente.js
        └── Aninal.js
        src
        └── desafios
            ├── aplication
            │   └── desafio.js
            ├── dto
            │   ├── AmbienteToCheckDTO.js
            │   └── AnimalToCheckCompativelDTO.js
            ├── recintos-zoo.js
            └── recintos-zoo.test.js
```

## 🔨 Tools 
<div display="inline">
    <img align="center" alt="Java" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" />

## 02 - Configurações

Exemplo de chamada
```js
  new RecintosZoo().analisaRecintos('MACACO', 2);
```

### INSTALANDO E RODANDO NA SUA MÁQUINA
1. Instalar o [Node](https://nodejs.org/en/)
2. Instalar dependencias do projeto com o seguinte comando, na raiz do projeto:
```bash
npm install
```
3. No aquivo src/application/desafio.js, possue um exemplo. Pode ser alterado e rodado com o código:
``` bash
npm start
```


## 03 - Metodologia de testes

### VALIDANDO A SOLUÇÃO
Junto com a estrutura básica você está recebendo alguns cenários de testes no arquivo `recintos-zoo.test.js` para auxiliar na validação da sua solução. Foi criado mais casos de testes parar cobrir mais cenários, já que são apenas teste com banco de dados mokado, tive que fazer teste com apenas o cenário estático do banco. 
Para testar sua solução com os cenários existentes ou novos, rode o seguinte comando:
```bash
npm test
```

## Author 🧑🏼‍🎨

- [@ThiagoMdO](https://github.com/ThiagoMdO)
## Feedback

Se você tiver algum feedback, por favor me contate por email: oliveirathiagomendes@gmail.com


Mais informações no meu [Site de Portfolio](https://thiagomdo.github.io/Site_Portfolio/)
