import { renderBlock } from './lib.js'

export function renderUserBlock (username: string, avatarUrl: string, favoriteItemsAmount: number) {
  const favoritesCaption = favoriteItemsAmount < 1 ? 'ничего нет' : favoriteItemsAmount
  const hasFavoriteItems = favoriteItemsAmount < 1 ? false : true

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatarUrl}" alt="Wade Warren" />
      <div class="info">
          <p class="name">${username}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}
