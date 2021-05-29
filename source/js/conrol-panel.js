// Реализуем работу выбора тегов

const tagsItemElements = document.querySelectorAll(`.control-panel__tags-item`);
let currentActiveTagElement = document.querySelector(
  `.control-panel__tags-item--checked`
);

tagsItemElements.forEach((item) => {
  item.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    if (currentActiveTagElement) {
      currentActiveTagElement.classList.remove(
        `control-panel__tags-item--checked`
      );
    }
    item.classList.add(`control-panel__tags-item--checked`);
    currentActiveTagElement = item;
  });
});
