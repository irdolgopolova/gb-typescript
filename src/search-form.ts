import { renderBlock } from './lib.js'

function getFormatedDate(date: Date) {
  let year = date.toLocaleString("default", { year: "numeric" });
  let month = date.toLocaleString("default", { month: "2-digit" });
  let day = date.toLocaleString("default", { day: "2-digit" });

  return `${year}-${month}-${day}`;
}

export function renderSearchFormBlock(arrivalDate: string = '', leaveDate: string = '') {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMouth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  if (!arrivalDate) {
    arrivalDate = getFormatedDate(new Date(currentYear, currentMouth, currentDay + 1));
  }

  if (!leaveDate) {
    leaveDate = getFormatedDate(new Date(currentYear, currentMouth, currentDay + 3));
  }

  let today = getFormatedDate(currentDate);
  let lastDayDate = getFormatedDate(new Date(currentYear, currentMouth + 2, 1));

  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
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
            <input id="check-in-date" type="date" value=${arrivalDate} min=${today} max=${lastDayDate} name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value=${leaveDate} min=${today} max=${lastDayDate} name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
