
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


// Настроим отображение блоков с подсказками
const hintWrapperElements = document.querySelectorAll(`.filters__hint-wrapper`);
const clientWidth = document.body.clientWidth;
const overlayElement = document.querySelector(`.filters__overlay`);

hintWrapperElements.forEach((hintElement) => {
  const hintIconElement = hintElement.querySelector(`.filters__hint-link`);
  hintIconElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const hintBlockElement = hintElement.querySelector(`.filters__hint-desc-block`);
    hintBlockElement.classList.add(`filters__hint-desc-block--show`);
    overlayElement.classList.add(`overlay--show`);

    // Проверям вместиться ли окно по ширине
    const clickX = evt.clientX;
    const distanceEdge = clientWidth - clickX;
    const widthHintBlock = hintBlockElement.offsetWidth;
    const positionHintBlock = hintBlockElement.offsetLeft;

    if (distanceEdge < widthHintBlock) {
      hintBlockElement.style.left = positionHintBlock - widthHintBlock + `px`;
      hintBlockElement.classList.add(`filters__hint-desc-block--right`);
    } else {
      hintBlockElement.classList.add(`filters__hint-desc-block--left`);
    }

    // Повесим обработчик на закрытие окна
    overlayElement.addEventListener(`click`, () => {
      if (hintBlockElement.classList.contains(`filters__hint-desc-block--right`)) {
        hintBlockElement.style.left = positionHintBlock + `px`;
      }
      hintBlockElement.classList.remove(`filters__hint-desc-block--show`);
    });
  });
});


// Настройка регулировки цены
const Toggles = {
  MIN: `min`,
  MAX: `max`
};
const leftToggleElement = document.querySelector(`.filters__bar-toggle--min`);
const rightToggleElement = document.querySelector(`.filters__bar-toggle--max`);
const scaleBarElement = document.querySelector(`.filters__scale-bar`);
const WIDTH_SCALE = document.querySelector(`.filters__range-controls`).offsetWidth;
const MIN_MARGIN = 10;

let touchFilterToggle = function (evt, toggle) {
  const startX = evt.touches[0].clientX;
  const positionToggle = toggle.offsetLeft;
  const widthScaleBar = scaleBarElement.offsetWidth;
  toggle.classList.add(`filters__bar-toggle--increased`);

  const onToggleMove = function (evt) {
    let walkX = Math.ceil(evt.touches[0].clientX) - startX;
    toggle.style.left = positionToggle + walkX + `px`;

    const movingScaleAndToggle = () => {
      switch (toggle.dataset.priceToggle) {
        case Toggles.MIN:
          scaleBarElement.style.left = toggle.style.left;
          scaleBarElement.style.width = widthScaleBar - walkX + `px`;

          // Сделаем чтобы при упирания левого тоггла в край шкалы движение останавливалось
          if (toggle.offsetLeft <= 0) {
            toggle.style.left = `0px`;
            scaleBarElement.style.left = `0px`;
            scaleBarElement.style.width = rightToggleElement.offsetLeft + `px`;
          }

          // Сделаем чтобы при встрече с правым тоглом движение останавливалось
          if (toggle.offsetLeft >= (rightToggleElement.offsetLeft - MIN_MARGIN)) {
            toggle.style.left = rightToggleElement.offsetLeft - MIN_MARGIN + `px`;
            scaleBarElement.style.left = rightToggleElement.offsetLeft - MIN_MARGIN + `px`;
            scaleBarElement.style.width = MIN_MARGIN + `px`;
          }
          break;
        case Toggles.MAX:
          scaleBarElement.style.width = widthScaleBar + walkX + `px`;

          // Сделаем чтобы при упирания правого тоггла в край шкалы движение останавливалось
          if (toggle.offsetLeft >= WIDTH_SCALE) {
            toggle.style.left = WIDTH_SCALE + `px`;
            scaleBarElement.style.width = WIDTH_SCALE - leftToggleElement.offsetLeft + `px`;
          }

          // Сделаем чтобы при встрече с левым тоглом движение останавливалось
          if (toggle.offsetLeft <= (leftToggleElement.offsetLeft + MIN_MARGIN)) {
            toggle.style.left = leftToggleElement.offsetLeft + MIN_MARGIN + `px`;
            scaleBarElement.style.width = MIN_MARGIN + `px`;
          }
          break;

        default:
          console.log(`Не понятно куда ты нажал!`);
      }
    };

    movingScaleAndToggle();
  };

  const onToggleStop = function () {
    toggle.classList.remove(`filters__bar-toggle--increased`);
    document.removeEventListener(`touchmove`, onToggleMove);
    document.removeEventListener(`touchend`, onToggleStop);
  };

  document.addEventListener(`touchmove`, onToggleMove);
  document.addEventListener(`touchend`, onToggleStop);
};

leftToggleElement.addEventListener(`touchstart`, function (evt) {
  touchFilterToggle(evt, leftToggleElement);
});

rightToggleElement.addEventListener(`touchstart`, function (evt) {
  touchFilterToggle(evt, rightToggleElement);
});
