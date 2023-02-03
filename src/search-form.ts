import { renderBlock } from './lib.js'
import { SearchFormData } from './search-form-data.js';

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

  function search(searchFormData: SearchFormData) {
    console.log(searchFormData);
  }

  const test = (event) => {
    console.log(event);
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
            <input type="hidden" disabled value="59.9386,30.3141" />
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
            <div><button id=submitBtn >Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  document.querySelector('#submitBtn').addEventListener('click', function (event) {
    event.preventDefault();
    const searchForm = document.forms[0];

    console.log(searchForm.elements);

    return {
      city: searchForm.elements[0].value,
      arrivalDate: searchForm.elements[0].value,
      leaveDate: searchForm.elements[0].value,
      price: searchForm.elements[0].value
    }

  });
}
