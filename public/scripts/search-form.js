var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { renderBlock } from './lib.js';
import { renderEmptyOrErrorSearchBlock, renderSearchResultsBlock } from './search-results.js';
import { FlatRentSdk } from './flat-rent-sdk.js';
const flatRentSdk = new FlatRentSdk();
function getFormatedDate(date) {
    let year = date.toLocaleString("default", { year: "numeric" });
    let month = date.toLocaleString("default", { month: "2-digit" });
    let day = date.toLocaleString("default", { day: "2-digit" });
    return `${year}-${month}-${day}`;
}
export function renderSearchFormBlock(searchFormData) {
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
    function renderResult(results) {
        if (results.length === 0) {
            renderEmptyOrErrorSearchBlock("Ничего не найдено");
        }
        else {
            renderSearchResultsBlock(results);
        }
    }
    const search = (searchFormData) => __awaiter(this, void 0, void 0, function* () {
        let dataOfPlace = [];
        yield flatRentSdk.search({
            checkInDate: new Date(searchFormData.arrivalDate),
            checkOutDate: new Date(searchFormData.leaveDate),
            city: searchFormData.city,
            priceLimit: searchFormData.price
        })
            .then(data => {
            if (data.length !== 0) {
                let dataSearch = data.map((element) => {
                    let newElement = {
                        id: element.id,
                        image: element.photos[0],
                        name: element.title,
                        price: element.totalPrice,
                        description: element.details,
                        coordinates: element.coordinates,
                        remoteness: "0"
                    };
                    return newElement;
                });
                dataOfPlace = [...dataOfPlace, ...dataSearch];
            }
        })
            .catch(error => renderEmptyOrErrorSearchBlock(error));
        const coordinates = searchFormData.coordinates;
        const checkInDate = new Date(searchFormData.arrivalDate).getTime();
        const checkOutDate = new Date(searchFormData.leaveDate).getTime();
        const maxPrice = searchFormData.price;
        yield fetch(`http://localhost:3030/places?coordinates=${coordinates}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&maxPrice=${maxPrice}`)
            .then(responce => responce.json())
            .then(data => {
            if (data.length !== 0) {
                dataOfPlace = [...dataOfPlace, ...data];
            }
        })
            .catch(error => renderEmptyOrErrorSearchBlock(error));
        renderResult(dataOfPlace);
    });
    renderBlock('search-form-block', `
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
    `);
    const submitBtn = document.querySelector('#submitBtn');
    if (submitBtn)
        submitBtn.addEventListener('click', function (event) {
            event.preventDefault();
            search({
                city: document.getElementById("city").value,
                coordinates: document.getElementById("coordinates").value,
                arrivalDate: document.getElementById("check-in-date").value,
                leaveDate: document.getElementById("check-out-date").value,
                price: Number(document.getElementById("max-price").value)
            });
        });
}
