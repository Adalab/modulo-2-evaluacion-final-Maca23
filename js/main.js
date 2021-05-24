"use strict";

let arraySeries = [];
let favorites = [];

const searchBtn = document.querySelector(".js-search-btn");
const searchInput = document.querySelector(".js-search-input");
const ulSeries = document.querySelector(".js-series");
const seriesFav = document.querySelector(".js-series-fav");

//SEARCH
//Al hacer clic sobre el botón de Buscar, la aplicación debe conectarse al API abierto de TVMaze para la búsqueda de series
function searchSeries() {
  arraySeries = [];
  const searchInputValue = searchInput.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${searchInputValue}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        arraySeries.push(element.show);
      });

      paintSeries(arraySeries);
    });
}

//Por cada serie contenido en el resultado de la búsqueda hay que pintar una tarjeta donde mostramos una imagen de la serie y el título. Algunas de las series que devuelve el API no tienen imagen. En ese caso hay que mostrar una imagen de relleno
function getHtmlCode(series) {
  let htmlCode = "";
  for (const serie of series) {
    htmlCode += `<li class="cards js-cards" id= "${serie.id}">`;
    if (serie.image === null) {
      htmlCode += `<img class="cards-content-img" src="${"https://via.placeholder.com/210x295/ffffff/666666/?text=TV"}" />`;
    } else {
      htmlCode += `<img class="cards-img" src="${serie.image.medium}" />`;
    }
    htmlCode += `<h2 class="cards-title">${serie.name}</h2>`;
    htmlCode += `</li>`;
  }

  return htmlCode;
}

function paintSeries(arraySeries) {
  let htmlCode = getHtmlCode(arraySeries);
  ulSeries.innerHTML = htmlCode;
  addEventListenerToCards();
}

function addEventListenerToCards() {
  const allCards = document.querySelectorAll(".js-cards");
  for (const cards of allCards) {
    cards.addEventListener("click", handleFavList);
  }
}
searchBtn.addEventListener("click", searchSeries);
addEventListenerToCards() 

//Una vez aparecen los resultados de búsqueda, la usuaria puede indicar cuáles son nuestras series favoritas
function handleFavList(ev) {
  const upDateFav = ev.currentTarget; //para coger toda la info, target es solo para coger info en concreto
  let favId = ev.currentTarget.id;
  const showFav = favorites.find((element) => element.id === parseInt(favId));
  if (showFav == null) {
    const selectedSeriesFav = arraySeries.find(
      (element) => element.id === parseInt(favId)
    );
    favorites.push(selectedSeriesFav);
    upDateFav.classList.remove("cards");
    upDateFav.classList.add("seriescolor");
  } else {
    let selectedSeriesFav2 = favorites.indexOf(showFav);
    favorites.splice(selectedSeriesFav2, 1);
    upDateFav.classList.add("cards");
    upDateFav.classList.remove("seriescolor");
  
  }
  localStorage.setItem('series', JSON.stringify(favorites));
  paintSeriesFav(favorites);
}

function paintSeriesFav(favorites) {
  let htmlCode = getHtmlCode(favorites);
  seriesFav.innerHTML = htmlCode;
}

const saveSeriesFav = JSON.parse(localStorage.getItem('series'));
if (saveSeriesFav) {
    favorites = saveSeriesFav;
};

paintSeriesFav(favorites);