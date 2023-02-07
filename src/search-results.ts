import { renderBlock } from './lib.js'
import { FavoritePlace } from './favorite-place.js'
import { renderUserBlock } from './user.js';

const keyFavoriteItems = 'favoriteItems';

export function renderSearchStubBlock () {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock (reasonMessage) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

function renderList(results) {
  let arrayElements =  results.map(element => {
    return (`
    <li id="result_${element.id}" class="result">
      <div class="result-container">
        <div class="result-img-container">
          <div id="favorites_${element.id}" class="favorites ${getClassForElement(element.id)}"></div>
          <img class="result-img" src="${element.image}" alt="">
        </div>
        <div class="result-info">
          <div class="result-info--header">
            <p>${element.name}l</p>
            <p class="price">${element.price}&#8381;</p>
          </div>
          <div class="result-info--map"><i class="map-icon"></i> ${element.remoteness}км от вас</div>
          <div class="result-info--descr">${element.description}</div>
          <div class="result-info--footer">
            <div>
              <button>Забронировать</button>
            </div>
          </div>
        </div>
      </div>
    </li>
  `)});

  return arrayElements.join('');
}

function getClassForElement(elementId: number) {
  return isFavoriteItemExist(elementId) ? "active" : "";
}

function getFavoriteItems() {
  return JSON.parse(localStorage.getItem(keyFavoriteItems)) ?? [];
}

function isFavoriteItemExist(elementId: number) {
  return getFavoriteItems().find((element) => element.id === elementId);
}

function toggleFavoriteItem(favoritePlace: FavoritePlace) {
  let favoriteItems = getFavoriteItems();

  if (isFavoriteItemExist(favoritePlace.id)) {
    favoriteItems = favoriteItems.filter(element => element.id !== favoritePlace.id);
  } else {
    favoriteItems.push(favoritePlace);
  }

  localStorage.setItem(keyFavoriteItems, JSON.stringify(favoriteItems));
  renderUserBlock('Wade Warren', '/img/avatar.png', Object.keys(favoriteItems).length);
}

function renderEventClick(results) {
  results.forEach(element => {
    document.getElementById(`favorites_${element.id}`).addEventListener("click", (event) => {
      (event.currentTarget as HTMLElement).classList.toggle("active");

      toggleFavoriteItem({
        id: element.id,
        name: element.name,
        image: element.image
      });
    });
  });
}

export function renderSearchResultsBlock(results) {
  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      ${renderList(results)}
    </ul>
    `
  );

  renderEventClick(results);
}
