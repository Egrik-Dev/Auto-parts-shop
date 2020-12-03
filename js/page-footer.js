const MenuStatus = {
  CLOSED: `closed`,
  OPENED: `opened`,
};

const DESKTOP_WIDTH = 1170;
const clientWidth = document.body.clientWidth;
const menuElement = document.querySelectorAll(`.page-footer__nav-item-list`);

const go = function (menuItem) {
  toggleMenu(menuItem)
    .then((list) => {
      if (list.dataset.menuStatus === MenuStatus.CLOSED) {
        list.classList.remove(`page-footer__nav-list--opened`);
      }
    });
};

const toggleMenu = function (menuItem) {
  return new Promise(function (resolve) {
    const submenuElement = menuItem.querySelector(`.page-footer__nav-list`);
    const arrowElement = menuItem.querySelector(`.page-footer__nav-arrow`);

    if (submenuElement.dataset.menuStatus === MenuStatus.CLOSED) {
      submenuElement.dataset.menuStatus = MenuStatus.OPENED;
      // Вычисляем высоту подменю и применяем её
      const submenuChildrens = submenuElement.children;
      let totalHeight = 0;

      for (let item of submenuChildrens) {
        totalHeight += item.clientHeight;
        // Останавливаем всплытие по клику на ссылку
        item.addEventListener(`click`, (evt) => {
          evt.stopPropagation();
        });
      }

      submenuElement.style.height = `${totalHeight}px`;

      // Добавляем класс для открытия подменю
      submenuElement.classList.add(`page-footer__nav-list--opened`);
      // Переворачиваем стрелочку
      arrowElement.style = `transform: rotate(180deg);`;
    } else {
      submenuElement.dataset.menuStatus = MenuStatus.CLOSED;
      submenuElement.style.height = `0`;
      arrowElement.style = `transform: rotate(0deg);`;
    }

    menuItem.addEventListener(`transitionend`, function handler() {
      menuItem.removeEventListener(`transitionend`, handler);
      resolve(submenuElement);
    });
  });
};

if (clientWidth < DESKTOP_WIDTH) {
  menuElement.forEach((elem) => {
    elem.addEventListener(`click`, () => {
      go(elem);
    });
  });
}
