//array to hold pokemonRepository list within IIEF function
//whatever will be returned from it will be the content of the pokemon repository
// only what is returned  at the end of the IIEF, is what can be accessed when pokemonRepo is mentioned.

let pokemonRepository = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  let searchInput = document.querySelector("#searchIn");
  let pokemon = "";

  function add(pokemon) {
    if (typeof pokemon === 'object' &&
     'name' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }

  function getAll() { 
    return pokemonList;
  }

  function addListItem(pokemon) {
    let pokemonList = document.querySelector('.list-group');
    let listPokemon = document.createElement('li');
    listPokemon.classList.add('list-group-item', 'list-group-item-action');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('btn', 'btn-block');
    button.setAttribute('data-target', '#pokemonModal', 'data-toggle', 'modal');
    pokemonList.appendChild(listPokemon);
    listPokemon.appendChild(button);
    button.addEventListener('click', function() {
      showDetails(pokemon);
    });
  }

// loading list of all pokemons after fetching from an API
function loadList() {
  return fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      json.results.forEach(function(item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.imageUrlBack = details.sprites.back_default;
      item.height = details.height;
      //pokemon types
      item.types = [];
      for (var i=0; i < details.types.length; i++) {
        item.types.push(details.types[i].type.name);
      }
      //pokemon abilities
      item.abilities = [];
      for (var i=0; i < details.abilities.length; i++) {
        item.abilities.push(details.abilities[i].ability.name);
      }

    }).catch(function (e) {
      console.error(e);
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      showModal(item);
    });
  }

  // modal function
  function showModal(item) {
    pokemonRepository.loadDetails(item).then(function() {
    let modalBody = $(".modal-body");
    let modalTitle = $(".modal-title");
    let modalHeader = $(".modal-header");

    //clear all modal content
    modalBody.empty();
    modalTitle.empty();

    //Pokemon name
    let nameElement = $('<h1>' + item.name + '</h1>');

    //pokemon types
    let pokTypes = $('<p>' + 'Types: ' + item.types + '</p>');

    //pokemon abilities
    let pokAbilities = $('<p>' + 'Abilities: ' + item.abilities + '</p>');

    //Pokemon height
    let heightElement = $('<p>' + 'Height: ' + item.height + '</p>');

    //pokemon image front
    let pokImageFront = $('<img class="modal-img" style="width:20%">');
    pokImageFront.attr('src', item.imageUrl);

    //pokemon image back
    let pokImageBack = $('<img class="modal-img" style="width:20%">');
    pokImageBack.attr('src', item.imageUrlBack);

    //add event listener to search bar to find pokemon in the list
    searchInput.addEventListener('input', function(){
    let listPokemon = document.querySelectorAll('.list-group-item');
    let value = searchInput.value.toUpperCase();

    listPokemon.forEach(function(pokemon){
       if(pokemon.innerText.toUpperCase().indexOf(value) > -1){
           pokemon.style.display = '';
       }else{
           pokemon.style.display = 'none';
       }
   })
});

    //append all elements created to the modal
    modalTitle.append(nameElement);
    modalBody.append(pokTypes);
    modalBody.append(pokAbilities);
    modalBody.append(heightElement);
    modalBody.append(pokImageFront);
    modalBody.append(pokImageBack);

    $('#pokemonModal').modal('toggle');
  });
}

// the return object has reference to the local functions in the IIEF
return {
  add: add,
  getAll: getAll,
  addListItem: addListItem,
  loadList: loadList,
  loadDetails: loadDetails,
  showDetails: showDetails
};
})();

pokemonRepository.loadList().then(function() {
  //looping through the array list of pokemons using foreach().
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});// JavaScript Document