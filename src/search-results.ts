import { renderBlock } from './lib.js'

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
  let arrayElements =  results.map(element => (`
    <li class="result">
    <div class="result-container">
      <div class="result-img-container">
        <div class="favorites active"></div>
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
  `));

  return arrayElements.join('');
}

export function renderSearchResultsBlock(results) {
  // console.log("results", results);
  // console.log(renderList(results));

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
  )
}
