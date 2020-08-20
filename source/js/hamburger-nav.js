const hamburgerBtn = document.querySelector(`.user-menu__nav-toggle`);
const sideMenu = document.querySelector(`.main-wrapper__hamburger-nav`);
const mainContainer = document.querySelector(`.main-wrapper__content-container`);
const overlayElement = document.querySelector(`.overlay`);
const bodyElement = document.querySelector(`body`);

hamburgerBtn.addEventListener(`click`, () => {
  sideMenu.classList.add(`main-wrapper__hamburger-nav--open`);
  mainContainer.classList.add(`main-wrapper__content-container--filter-active`);
  overlayElement.classList.add(`overlay--show`);
  bodyElement.style.overflow = `hidden`;
});

overlayElement.addEventListener(`click`, () => {
  sideMenu.classList.remove(`main-wrapper__hamburger-nav--open`);
  mainContainer.classList.remove(`main-wrapper__content-container--filter-active`);
  overlayElement.classList.remove(`overlay--show`);
  bodyElement.removeAttribute(`style`);
});
