import { renderBlock } from './lib.js'
import { SearchFormData } from './search-form-data.js';
import { renderEmptyOrErrorSearchBlock, renderSearchResultsBlock } from './search-results.js';
import { FlatRentSdk } from './flat-rent-sdk.js';

const flatRentSdk = new FlatRentSdk();

function getFormatedDate(date: Date) {
  let year = date.toLocaleString("default", { year: "numeric" });
  let month = date.toLocaleString("default", { month: "2-digit" });
  let day = date.toLocaleString("default", { day: "2-digit" });

  return `${year}-${month}-${day}`;
}

export function renderSearchFormBlock(searchFormData: SearchFormData) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMouth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  if (!searchFormData.arrivalDate) {
    searchFormData.arrivalDate = getFormatedDate(new Date(currentYear, currentMouth, currentDay + 1));
  }

  if (!searchFormData.leaveDate) {
    searchFormData.leaveDate = getFormatedDate(new Date(currentYear, currentMouth, currentDay + 3));
  }

  let today = getFormatedDate(currentDate);
  let lastDayDate = getFormatedDate(new Date(currentYear, currentMouth + 2, 1));

  function renderResult(results: Array<ResultsData>) {
    if (results.length === 0) {
      renderEmptyOrErrorSearchBlock("Ничего не найдено");
    } else {
      renderSearchResultsBlock(results)
    }
  }

  const search = async (searchFormData: SearchFormData) => {
    let dataOfPlace: Array<ResultsData> = [];

    await flatRentSdk.search({
        checkInDate: new Date(searchFormData.arrivalDate),
        checkOutDate: new Date(searchFormData.leaveDate),
        city: searchFormData.city,
        priceLimit: searchFormData.price
      })
      .then(data => {
        if (data.length !== 0) {
          let dataSearch: Array<ResultsData> = data.map((element: any) => {
            let newElement: ResultsData = {
              id: element.id,
              image: element.photos[0],
              name: element.title,
              price: element.totalPrice,
              description: element.details,
              coordinates: element.coordinates,
              remoteness: "0"
            }
            return newElement
          });

          dataOfPlace = [...dataOfPlace, ...dataSearch];
        }
      })
      .catch(error => renderEmptyOrErrorSearchBlock(error));

    const coordinates = searchFormData.coordinates;
    const checkInDate = new Date(searchFormData.arrivalDate).getTime();
    const checkOutDate = new Date(searchFormData.leaveDate).getTime();
    const maxPrice = searchFormData.price;

    await fetch(`http://localhost:3030/places?coordinates=${coordinates}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&maxPrice=${maxPrice}`)
      .then(responce => responce.json())
      .then(data => {
        if (data.length !== 0) {
          dataOfPlace = [...dataOfPlace, ...data]
        }
      })
      .catch(error => renderEmptyOrErrorSearchBlock(error));

      renderResult(dataOfPlace)
  }

  renderBlock(
    'search-form-block',
    `
    <form name="search">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" name="city" type="text" disabled value=${searchFormData.city} />
            <input id="coordinates" type="hidden" disabled value=${searchFormData.coordinates} />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value=${searchFormData.arrivalDate} min=${today} max=${lastDayDate} name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value=${searchFormData.leaveDate} min=${today} max=${lastDayDate} name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value=${searchFormData.price} name="price" class="max-price" />
          </div>
          <div>
            <div><button id="submitBtn">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  const submitBtn = document.querySelector('#submitBtn')
  if (submitBtn)
    submitBtn.addEventListener('click', function (event) {
      event.preventDefault();

      search({
        city: (document.getElementById("city") as HTMLInputElement).value,
        coordinates: (document.getElementById("coordinates") as HTMLInputElement).value,
        arrivalDate: (document.getElementById("check-in-date") as HTMLInputElement).value,
        leaveDate: (document.getElementById("check-out-date") as HTMLInputElement).value,
        price: Number((document.getElementById("max-price") as HTMLInputElement).value)
      });
    });
}
