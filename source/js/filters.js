
const filterBtnElement = document.querySelector(`.control-panel__filter-btn`);
const filtersSectionElevent = document.querySelector(`.filters`);
const bodyElement = document.querySelector(`body`);

filterBtnElement.addEventListener(`click`, () => {
  filtersSectionElevent.classList.add(`filters--open`);
  bodyElement.style.overflow = `hidden`;
});

const closeFilterElement = document.querySelector(`.filters__btn-close`);

closeFilterElement.addEventListener(`click`, () => {
  filtersSectionElevent.classList.remove(`filters--open`);
  bodyElement.removeAttribute(`style`);
});
