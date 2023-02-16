import { renderBlock } from './lib.js';
export function renderUserBlock(username, avatarUrl, favoriteItemsAmount = 0) {
    const favoritesCaption = favoriteItemsAmount < 1 ? 'ничего нет' : favoriteItemsAmount;
    const hasFavoriteItems = favoriteItemsAmount < 1 ? false : true;
    function getUserData() {
        var _a;
        const user = JSON.parse((_a = localStorage.getItem("user")) !== null && _a !== void 0 ? _a : "");
        return (user
            && typeof user === "object"
            && "username" in user
            && "avatarUrl" in user) ? user : null;
    }
    function getFavoritesAmount() {
        var _a;
        const favorites = JSON.parse((_a = localStorage.getItem("favoriteItemsAmount")) !== null && _a !== void 0 ? _a : "");
        return (favorites
            && typeof favorites === "number") ? favorites : null;
    }
    renderBlock('user-block', `
    <div class="header-container">
      <img class="avatar" src="${avatarUrl}" alt="Wade Warren" />
      <div class="info">
          <p class="name">${username}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `);
}
