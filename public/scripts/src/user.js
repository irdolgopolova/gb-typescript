import { renderBlock } from './lib.js';
export function renderUserBlock(username, avatarUrl, favoriteItemsAmount = 0) {
    const favoritesCaption = favoriteItemsAmount < 1 ? 'ничего нет' : favoriteItemsAmount;
    const hasFavoriteItems = favoriteItemsAmount < 1 ? false : true;
    function getUserData() {
        const user = JSON.parse(localStorage.getItem("user"));
        return (user
            && typeof user === "object"
            && "username" in user
            && "avatarUrl" in user) ? user : null;
    }
    function getFavoritesAmount() {
        const favorites = JSON.parse(localStorage.getItem("favoriteItemsAmount"));
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
