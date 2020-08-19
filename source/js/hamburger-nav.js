const SideNavStatus = Object.create(null);
SideNavStatus.OPENED = `opened`;
SideNavStatus.CLOSED = `closed`;

const hamburgerBtn = document.querySelector(`.user-menu__nav-toggle`);
const sideMenu = document.querySelector(`.main-wrapper__hamburger-nav`);
const mainContainer = document.querySelector(`.main-wrapper__content-container`);
const bodyElement = document.querySelector(`body`);

hamburgerBtn.addEventListener(`click`, () => {
  if (hamburgerBtn.dataset.navStatus === SideNavStatus.CLOSED) {
    hamburgerBtn.dataset.navStatus = SideNavStatus.OPENED;
    sideMenu.classList.add(`main-wrapper__hamburger-nav--open`);
    mainContainer.classList.add(`main-wrapper__content-container--filter-active`);
    bodyElement.style.overflow = `hidden`;
  } else {
    hamburgerBtn.dataset.navStatus = SideNavStatus.CLOSED;
    sideMenu.classList.remove(`main-wrapper__hamburger-nav--open`);
    mainContainer.classList.remove(`main-wrapper__content-container--filter-active`);
    bodyElement.removeAttribute(`style`);
  }
});
