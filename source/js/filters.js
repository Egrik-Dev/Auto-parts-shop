import { disableBodyScroll, enableBodyScroll } from "./bodyScrollLock.es6.js";
import { makeMenuToggle } from "./menu-toggle.js";
import { FiltersSearch } from "./filters-search.js";
import { DESKTOP_WIDTH } from "./const.js";
import { brandTyresMocks, modelTyresMocks, countriesMocks } from "./mocks.js";
import { LargeSelectionFilter } from "./large-selection-filter.js";

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
  const hintBlockElement = hintElement.querySelector(
    `.filters__hint-desc-block`
  );
  const positionHintBlock = hintBlockElement.offsetLeft;

  hintIconElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    hintBlockElement.classList.add(`filters__hint-desc-block--show`);
    overlayElement.classList.add(`overlay--show`);

    // Проверям вместиться ли окно по ширине
    const clickX = evt.clientX;
    const distanceEdge = clientWidth - clickX;
    const widthHintBlock = hintBlockElement.offsetWidth;

    if (distanceEdge < widthHintBlock) {
      hintBlockElement.style.left = positionHintBlock - widthHintBlock + `px`;
      hintBlockElement.classList.add(`filters__hint-desc-block--right`);
    } else {
      hintBlockElement.classList.add(`filters__hint-desc-block--left`);
    }

    const removeHint = () => {
      if (
        hintBlockElement.classList.contains(`filters__hint-desc-block--right`)
      ) {
        hintBlockElement.style.left = positionHintBlock + `px`;
      }
      hintBlockElement.classList.remove(`filters__hint-desc-block--show`);
      overlayElement.classList.remove(`overlay--show`);

      overlayElement.removeEventListener(`click`, removeHint);
    };

    // Повесим обработчик на закрытие окна
    overlayElement.addEventListener(`click`, removeHint);
  });
});

// НАСТРОЙКА РЕГУЛИРОВКИ ЦЕНЫ
const Toggles = {
  MIN: `min`,
  MAX: `max`,
};
const leftToggleElement = document.querySelector(`.filters__bar-toggle--min`);
const rightToggleElement = document.querySelector(`.filters__bar-toggle--max`);
const scaleBarElement = document.querySelector(`.filters__scale-bar`);
const rangeElement = document.querySelector(`.filters__range-controls`);
// Вычитаем ширину тоггла чтобы при максимальной выкрутке он не исчезал за край экрана
const WIDTH_SCALE = rangeElement.offsetWidth - leftToggleElement.offsetWidth;
const MAX_PRICE = 50000;
const inputMin = document.querySelector(`#minpriceinput`);
const inputMax = document.querySelector(`#maxpriceinput`);

const calculatePriceValue = function (togglePosition) {
  return Math.round(((MAX_PRICE / WIDTH_SCALE) * togglePosition) / 100) * 100;
};

inputMin.value = calculatePriceValue(leftToggleElement.offsetLeft);
inputMax.value = calculatePriceValue(rightToggleElement.offsetLeft);

// Проверям поддерживает ли тач устройство
function isTouchDevice() {
  return !!(`ontouchstart` in window);
}

const EventsToggle = {
  START: isTouchDevice() ? `touchstart` : `mousedown`,
  MOVE: isTouchDevice() ? `touchmove` : `mousemove`,
  END: isTouchDevice() ? `touchend` : `mouseup`,
};

let touchFilterToggle = function (evt, toggle) {
  evt.preventDefault();
  let startX = evt.clientX || evt.touches[0].clientX;
  const positionToggle = toggle.offsetLeft;

  if (clientWidth < DESKTOP_WIDTH) {
    disableBodyScroll(evt.target);
  }

  const onToggleMove = function (moveEvt) {
    let walkX =
      Math.ceil(moveEvt.clientX || moveEvt.touches[0].clientX) - startX;
    let coordXToggle = positionToggle + walkX;
    toggle.style.left = coordXToggle + `px`;
    scaleBarElement.style.width =
      rightToggleElement.offsetLeft - leftToggleElement.offsetLeft + `px`;

    const movingScaleAndToggle = () => {
      switch (toggle.dataset.priceToggle) {
        case Toggles.MIN:
          scaleBarElement.style.left = coordXToggle + `px`;
          inputMin.value = calculatePriceValue(coordXToggle);

          // Сделаем чтобы при упирания левого тоггла в край шкалы движение останавливалось
          if (coordXToggle < 0) {
            toggle.style.left = `0px`;
            scaleBarElement.style.left = `0px`;
            scaleBarElement.style.width = rightToggleElement.offsetLeft + `px`;
            inputMin.value = 0;
          }

          if (coordXToggle >= rightToggleElement.offsetLeft) {
            toggle.style.left = rightToggleElement.offsetLeft + `px`;
            scaleBarElement.style.left = rightToggleElement.offsetLeft + `px`;
            scaleBarElement.style.width = `0px`;
            inputMin.value = calculatePriceValue(rightToggleElement.offsetLeft);
          }
          break;
        case Toggles.MAX:
          inputMax.value = calculatePriceValue(coordXToggle);

          // Сделаем чтобы при упирания правого тоггла в край шкалы движение останавливалось
          if (coordXToggle > WIDTH_SCALE) {
            toggle.style.left = WIDTH_SCALE + `px`;
            scaleBarElement.style.width =
              WIDTH_SCALE - leftToggleElement.offsetLeft + `px`;
            inputMax.value = MAX_PRICE;
          }

          if (coordXToggle <= leftToggleElement.offsetLeft) {
            toggle.style.left = leftToggleElement.offsetLeft + `px`;
            scaleBarElement.style.width = `0px`;
            inputMax.value = calculatePriceValue(leftToggleElement.offsetLeft);
          }
          break;
      }
    };

    movingScaleAndToggle();
  };

  const onToggleStop = function () {
    // Проверим находятся ли оба тоггла на max значении
    if (leftToggleElement.offsetLeft === WIDTH_SCALE) {
      leftToggleElement.classList.add(`filters__bar-toggle--up`);
    } else {
      leftToggleElement.classList.remove(`filters__bar-toggle--up`);
    }
    enableBodyScroll(evt.target);
    document.removeEventListener(EventsToggle.MOVE, onToggleMove);
    document.removeEventListener(EventsToggle.END, onToggleStop);
  };

  document.addEventListener(EventsToggle.MOVE, onToggleMove);
  document.addEventListener(EventsToggle.END, onToggleStop);
};

leftToggleElement.addEventListener(EventsToggle.START, function (evt) {
  touchFilterToggle(evt, leftToggleElement);
});

rightToggleElement.addEventListener(EventsToggle.START, function (evt) {
  touchFilterToggle(evt, rightToggleElement);
});

// Напишем условие что при ручном изменении input менялись ползунки

const Inputs = {
  MIN: `minpriceinput`,
  MAX: `maxpriceinput`,
};

const manualChangePrice = function (evt) {
  const calculatedTogglePosition = evt.target.value / (MAX_PRICE / WIDTH_SCALE);
  const calculatedStartScale = inputMin.value / (MAX_PRICE / WIDTH_SCALE);
  scaleBarElement.style.left = calculatedStartScale + `px`;
  leftToggleElement.classList.remove(`filters__bar-toggle--up`);

  switch (evt.target.id) {
    case Inputs.MIN:
      leftToggleElement.style.left = calculatedTogglePosition + `px`;

      if (+evt.target.value < 0) {
        leftToggleElement.style.left = `0px`;
        scaleBarElement.style.left = `0px`;
        inputMin.value = 0;
      }

      if (+evt.target.value > +inputMax.value) {
        rightToggleElement.style.left = calculatedTogglePosition + `px`;
        inputMax.value = evt.target.value;
      }

      if (+evt.target.value > MAX_PRICE) {
        leftToggleElement.style.left = WIDTH_SCALE + `px`;
        rightToggleElement.style.left = WIDTH_SCALE + `px`;
        scaleBarElement.style.left = `0px`;
        scaleBarElement.style.width = `0px`;
        inputMax.value = MAX_PRICE;
        inputMin.value = MAX_PRICE;
        leftToggleElement.classList.add(`filters__bar-toggle--up`);
      }

      break;
    case Inputs.MAX:
      rightToggleElement.style.left = calculatedTogglePosition + `px`;

      if (+evt.target.value < 0) {
        leftToggleElement.style.left = `0px`;
        rightToggleElement.style.left = `0px`;
        scaleBarElement.style.left = `0px`;
        scaleBarElement.style.width = `0px`;
        inputMax.value = 0;
        inputMin.value = 0;
      }

      if (+evt.target.value < +inputMin.value) {
        leftToggleElement.style.left = calculatedTogglePosition + `px`;
        inputMin.value = evt.target.value;
      }

      if (+evt.target.value > MAX_PRICE) {
        inputMax.value = MAX_PRICE;
        rightToggleElement.style.left = WIDTH_SCALE + `px`;
      }
      break;
  }

  scaleBarElement.style.width =
    rightToggleElement.offsetLeft - leftToggleElement.offsetLeft + `px`;
};

const priceInputElements = document.querySelectorAll(`.filters__price-number`);
priceInputElements.forEach((input) => {
  input.addEventListener(`input`, (evt) => {
    manualChangePrice(evt);
  });
});

// Настроим поиск по фильтрам
const brandContainer = document.querySelector(`.filters__fieldset--brand`);
const brandSearchFilter = new FiltersSearch(brandContainer, brandTyresMocks);
brandSearchFilter.init();

const modelContainer = document.querySelector(`.filters__fieldset--model`);
const modelSearchFilter = new FiltersSearch(modelContainer, modelTyresMocks);
modelSearchFilter.init();

const countriesContainer = document.querySelector(
  `.filters__fieldset--checkbox-model`
);
const countriesFilter = new LargeSelectionFilter(
  countriesContainer,
  countriesMocks
);
countriesFilter.init();

// Сделаем выпадающие пункты фильтров
const mainContainers = document.querySelectorAll(
  `[data-menu="main-container"]`
);
mainContainers.forEach((container) => makeMenuToggle(container));

// Напишем фун-ию переключения страниц пагинации
const itemPagElements = document.querySelectorAll(`[data-pag="item"]`);

let currentActivePagItem = document.querySelector(
  `.products-catalog__pagination-item--active`
);

itemPagElements.forEach((item) => {
  item.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    const target = evt.currentTarget;

    if (target !== currentActivePagItem) {
      currentActivePagItem.classList.remove(
        `products-catalog__pagination-item--active`
      );
      currentActivePagItem = target;
      currentActivePagItem.classList.add(
        `products-catalog__pagination-item--active`
      );
    }
  });
});
