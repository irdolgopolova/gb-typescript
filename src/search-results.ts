import { renderBlock } from './lib.js'
import { FavoritePlace } from './favorite-place.js'
import { renderUserBlock } from './user.js';

const keyFavoriteItems = 'favoriteItems';
// let filter = "cheap";
// let results = [];

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

export function renderEmptyOrErrorSearchBlock(reasonMessage: string) {
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

function filterResult(results: Array<ResultsData>, filter: string) {
  switch (filter) {
    case "cheap":
      console.log("cheap")
      results = results.sort((elem1, elem2) => elem1.price > elem2.price ? 1 : -1)
      break
    case "expensive":
      console.log("expensive")
      results = results.sort((elem1, elem2) => elem1.price < elem2.price ? 1 : -1)
      break
    case "closer":
      console.log("closer")
      results = results.sort((elem1, elem2) => elem1.remoteness > elem2.remoteness ? 1 : -1)
      break
    default:
      break;
  }

  return results
}

function renderList(results: Array<ResultsData>, filter: string) {
  results = filterResult(results, filter)

  let arrayElements = results.map(element => {
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

function getClassForElement(elementId: string) {
  return isFavoriteItemExist(elementId) ? "active" : "";
}

function getFavoriteItems() {
  return JSON.parse(localStorage.getItem(keyFavoriteItems) ?? "") ?? [];
}

function isFavoriteItemExist(elementId: string) {
  return getFavoriteItems().find((element: FavoritePlace) => element.id === elementId);
}

function toggleFavoriteItem(favoritePlace: FavoritePlace) {
  let favoriteItems = getFavoriteItems();

  if (isFavoriteItemExist(favoritePlace.id)) {
    favoriteItems = favoriteItems.filter((element: FavoritePlace)  => element.id !== favoritePlace.id);
  } else {
    favoriteItems.push(favoritePlace);
  }

  localStorage.setItem(keyFavoriteItems, JSON.stringify(favoriteItems));
  renderUserBlock('Wade Warren', '/img/avatar.png', Object.keys(favoriteItems).length);
}

function renderEventClick(results: Array<ResultsData>) {
  results.forEach(element => {
    const favorites = document.getElementById(`favorites_${element.id}`)
    if (favorites)
      favorites.addEventListener("click", (event) => {
        (event.currentTarget as HTMLElement).classList.toggle("active");

        toggleFavoriteItem({
          id: `${element.id}`,
          name: element.name,
          image: element.image
        });
      });
  });

  const sortSelect = document.querySelector('#sort-select');
  if (sortSelect)
    sortSelect.addEventListener('change', (event) => {
      console.log(event.target)
      const select = document.querySelector('#sort-select') as HTMLSelectElement
      const selectedOption = select.options[select.selectedIndex] as HTMLOptionElement

      renderSearchResultsBlock(results, selectedOption.value)
    })

}

export function renderSearchResultsBlock(results: Array<ResultsData>, filter = "cheap") {
  results = results;

  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select id="sort-select">
                <option value="cheap">Сначала дешёвые</option>
                <option value="expensive">Сначала дорогие</option>
                <option value="closer">Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      ${renderList(results, filter)}
    </ul>
    `
  );

  renderEventClick(results);
}
