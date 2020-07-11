const MenuStatus = {
  CLOSED: `closed`,
  OPENED: `opened`,
};
const menuElement = document.querySelectorAll(`.page-footer__nav-item-list`);

menuElement.forEach((item) => {
  item.addEventListener(`click`, () => {
    const submenuElement = item.querySelector(`.page-footer__nav-list`);
    const arrowElement = item.querySelector(`.page-footer__nav-arrow`);

    if (submenuElement.dataset.menuStatus === MenuStatus.CLOSED) {
      submenuElement.dataset.menuStatus = MenuStatus.OPENED;
      // Вычисляем высоту подменю и применяем её
      const submenuElements = item.querySelectorAll(`.page-footer__nav-item`);
      const heightSubmenuElement = submenuElements[0].offsetHeight;
      const HeightList = submenuElements.length * heightSubmenuElement;
      submenuElement.style.height = `${HeightList}px`;
      // Добавляем класс для открытия подменю
      submenuElement.classList.add(`page-footer__nav-list--opened`);
      // Переворачиваем стрелочку
      arrowElement.style = `transform: rotate(180deg);`;
    } else {
      submenuElement.dataset.menuStatus = MenuStatus.CLOSED;
      submenuElement.style.height = `0`;
      submenuElement.classList.remove(`page-footer__nav-list--opened`);
      arrowElement.style = `transform: rotate(0deg);`;
    }
  });
});
