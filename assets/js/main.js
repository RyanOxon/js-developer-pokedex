const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')



const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="loadPokemonDetails('${pokemon.name}')" >
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function convertPokemonToDetailsPage(pokemon) {
    return `
        <div class="pokemon ${pokemon.type}">
            <button class="close-button">X</button>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        
            
        </div>
        <div class="button-row">
                <button class="button ${pokemon.type}" data-info="about">About</button>
                <button class="button ${pokemon.type}" data-info="base-status">Base Status</button>
                <button class="button ${pokemon.type}" data-info="moves">Moves</button>
        </div>
        
        <div class="selected">
        

        </div>

            `
}

async function loadPokemonDetails(name) {
    const popup = document.createElement('div')
    popup.classList.add('popup')

    const pokemon = await pokeApi.getPokemonByName(name)
    console.log(pokemon)

    const newHtml = convertPokemonToDetailsPage(pokemon)
    popup.innerHTML = newHtml

    const closeButton = popup.querySelector('.close-button')
    closeButton.addEventListener('click', () => {
        popup.remove()
    })

    document.body.appendChild(popup)

    const buttonRow = document.querySelector('.button-row')
    const selected = document.querySelector('.selected')



    const clickHandler = (event) => {
        const button = event.target;
        const info = button.dataset.info;
    
        if (info === 'about') {
            selected.innerHTML = `
                <div class="about">
                    <ul class="block">
                        <li class="title">Height:</li>
                        <li class= "info"> ${pokemon.height/10} m</li>
                    </ul>
                    <ul class="block">
                        <li class="title">Weight:</li>
                    <li class= "info"> ${pokemon.weight/10} kg</li>
                    </ul>
                    <ul class="block">
                     <li class="title">Ability:</li>
                        ${pokemon.abilities.map((ability) => ` <li class= "info-ability">${ability}</li>`).join('')}
                    </ul>
                </div>
            `
        } else if (info === 'base-status') {
            selected.innerHTML = `
                <div class="stats">
                        ${pokemon.stats.map((stat) => `
                        <ul class="block">
                            <li class="name">${stat.name}: </li> 
                            <li class="value"> ${stat.value}</li>
                        </ul>`).join('')
                        }
                    
                </div>
            `
        } else if (info === 'moves') {
            selected.innerHTML = `
                <div class="Moves">
                    <ul>
                        ${pokemon.moves.map((move) => `<li>${move}</li>`).join('')}
                    </ul>
                </div>
            `
        }

    }
    buttonRow.addEventListener('click', clickHandler);

  // Close popup when clicked outside
  document.addEventListener('click', (event) => {
    if (!popup.contains(event.target) && !buttonRow.contains(event.target)) {
      popup.remove();
      buttonRow.removeEventListener('click', clickHandler);
    }
  });
}








function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})