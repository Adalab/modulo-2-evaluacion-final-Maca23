"use strict";

let arraySeries = [];
let favorites = [];

const searchBtn = document.querySelector(".js-search-btn");
const searchInput = document.querySelector(".js-search-input");
const ulSeries = document.querySelector(".js-series");
const seriesFav = document.querySelector(".js-series-fav");
const resetBtn = document.querySelector(".js-reset-btn");

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

function getHtmlCodeFav(favorites) {
  let htmlCode = "";
  for (const serie of favorites) {
    htmlCode += `<li class="cards-fav js-cards" id= "${serie.id}">`;
    if (serie.image === null) {
      htmlCode += `<img class="cards-content-img" src="${"https://via.placeholder.com/210x295/ffffff/666666/?text=TV"}" />`;
    } else {
      htmlCode += `<img class="cards-img-fav" src="${serie.image.medium}" />`;
    }
    htmlCode += `<h2 class="cards-title-fav">${serie.name}</h2>`;
    htmlCode += `<span class="close js-close" id="${serie.id}">x</span>`;
    htmlCode += `</li>`;
  }

  return htmlCode;
}

function handleReset() {
  favorites = [];
  seriesFav.innerHTML = "";
  paintSeries(arraySeries);
}

resetBtn.addEventListener("click", handleReset);

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
addEventListenerToCards();

function handleFavList(ev) {
  const upDateFav = ev.currentTarget; //para coger toda la info, target es solo para coger info en concreto
  let favId = ev.currentTarget.id;
  const showFav = favorites.find((element) => element.id === parseInt(favId));
  if (showFav === undefined) {
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
  localStorage.setItem("series", JSON.stringify(favorites));
  paintSeriesFav(favorites);
  addEventListenerClose();
}

function paintSeriesFav(favorites) {
  let htmlCode = getHtmlCodeFav(favorites);
  seriesFav.innerHTML = htmlCode;
}

function getLocalStorage() {
  const saveSeriesFav = JSON.parse(localStorage.getItem("series"));
  if (saveSeriesFav) {
    favorites = saveSeriesFav;
    paintSeriesFav(favorites);
    addEventListenerClose();
  }
}
getLocalStorage();

function removeItem(event) {
  let id = parseInt(event.currentTarget.id);
  const fav = favorites.find((element) => element.id === parseInt(id));
  removeFavoriteList(fav);
  paintSeriesFav(favorites);
  paintSeries(arraySeries);
  localStorage.setItem("series", JSON.stringify(favorites));
}
function removeFavoriteList(element) {
  let i = favorites.indexOf(element);
  favorites.splice(i, 1);
}

function addEventListenerClose() {
  const close = document.querySelectorAll(".js-close");
  for (const listClose of close) {
    listClose.addEventListener("click", removeItem);
  }
}