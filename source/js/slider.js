// Добавим импорты
import {createElement} from './utils.js';

export function MakeSlider(container, mode, isTimer = `no`, delay) {
  const Direction = {
    LEFT: `left`,
    RIGHT: `right`
  };
  const Mode = {
    LOOP: `loop`,
    ADAPTIVE: `adaptive`
  };
  const Flag = {
    YES: `yes`,
    NO: `no`
  };

  const slideElement = container.querySelector(`[data-slider="slide"]`);
  const widthSlide = slideElement.offsetWidth; // Ширина слайда
  const sliderListElement = container.querySelector(`[data-slider="list"]`); // Список с слайдами
  const togglesContainerElement = container.querySelector(`[data-toggle="list"]`);
  const leftBtnElement = container.querySelector(`[data-side="left"]`);
  const rightBtnElement = container.querySelector(`[data-side="right"]`);
  const GAP = Number(getComputedStyle(slideElement).marginRight.split(``).slice(0, -2).join(``));
  const sliderSize = widthSlide + GAP; // Общий размер карточки
  let QUANTITY_SLIDES;
  let currentPositionSlider;
  let currentPositionCircle;
  let widthContainer;
  let visibleCards;
  let hiddenCards;
  let maxWidthSlider;

  // Создадим метод который рассчитывает данные слайдера
  this.calculateSliderData = function () {
    QUANTITY_SLIDES = container.querySelectorAll(`[data-slider="slide"]`).length; // Всего слайдов
    currentPositionSlider = 0;
    currentPositionCircle = 0;
    widthContainer = container.querySelector(`[data-slider="container"]`).offsetWidth;
    visibleCards = Math.round(widthContainer / widthSlide); // Количество видимых карточек
    hiddenCards = QUANTITY_SLIDES - visibleCards; // Количество скрытых карточек
    maxWidthSlider = hiddenCards * sliderSize; // Оставшаяся ширина контейнера
  };

  // Запускаем фунцкию для стартового подсчёта
  this.calculateSliderData();

  // Функция которая меняет значения текущей позиции слайдера и тоггла
  const changeCurrentPosition = (direction) => {
    switch (direction) {
      case Direction.LEFT:
        currentPositionSlider += sliderSize;
        currentPositionCircle -= 1;
        break;
      case Direction.RIGHT:
        currentPositionSlider -= sliderSize;
        currentPositionCircle += 1;
        break;

      default:
        console.log(`Не понятно куда ты нажал!`);
    }

    makeSwitching();
  };

  // Запрограммируем работу слайдера по таймеру
  if (isTimer === Flag.YES) {
    setInterval(changeCurrentPosition, delay, Direction.RIGHT);
  }

  const goToFirstSlide = () => {
    sliderListElement.style.transform = `translateX(0px)`;
    currentPositionSlider = 0;
    currentPositionCircle = 0;
  };

  const goToLastSlide = () => {
    sliderListElement.style.transform = `translateX(-${maxWidthSlider}px)`;
    currentPositionSlider = -maxWidthSlider;
    currentPositionCircle -= 1;
  };

  const switchSLide = () => {
    sliderListElement.style.transform = `translateX(${currentPositionSlider}px)`;
  };

  // Напишем функцию которая переключает активный тогл
  const changeActiveToggle = () => {
    let activeElement = togglesContainerElement.querySelector(`[data-toggle-status="active"]`);
    activeElement.dataset.toggleStatus = `none`;
    togglesContainerElement.children[currentPositionCircle].dataset.toggleStatus = `active`;
  };

  const hideSideButton = (btn) => {
    btn.style.opacity = `0`;
    btn.style.pointerEvents = `none`;
  };

  const showSideButton = (btn) => {
    btn.style.opacity = `1`;
    btn.style.pointerEvents = `auto`;
  };

  const hideShowBtns = () => {
    // Убираем кнопку влево вначале, если слайдер Адаптивный
    if (mode === Mode.ADAPTIVE) {
      hideSideButton(leftBtnElement);

      // Убираем кнопку вправо если товаров меньше 4
      if (QUANTITY_SLIDES < 5) {
        hideSideButton(rightBtnElement);
      } else {
        showSideButton(rightBtnElement);
      }
    }
  };

  hideShowBtns();

  const makeSwitching = () => {
    switch (mode) {
      case Mode.LOOP:
        if (currentPositionSlider < -maxWidthSlider || currentPositionSlider > 0) {
          goToFirstSlide();
        } else {
          switchSLide();
        }
        break;
      case Mode.ADAPTIVE:
        if (currentPositionSlider < -maxWidthSlider) {
          goToLastSlide();
        } else if (currentPositionSlider > 0) {
          goToFirstSlide();
        } else {
          switchSLide();
          showSideButton(rightBtnElement);
          showSideButton(leftBtnElement);
        }

        if (currentPositionSlider === -maxWidthSlider) {
          hideSideButton(rightBtnElement);
        }

        if (currentPositionSlider === 0) {
          hideSideButton(leftBtnElement);
        }
        break;

      default:
        console.log(`Не понятно куда ты нажал!`);
    }

    sliderListElement.style.transition = `0.3s linear`;
    changeActiveToggle();
  };

  // Реализуем работу слайдера по свайпу с телефонов
  let startX;
  let walk;
  let endPos;

  sliderListElement.addEventListener(`touchstart`, (evt) => {
    startX = Math.ceil(evt.touches[0].clientX);
  });

  sliderListElement.addEventListener(`touchmove`, (evt) => {
    walk = Math.ceil(evt.touches[0].clientX) - startX;
    sliderListElement.style.transition = `0ms linear`;
    sliderListElement.style.transform = `translateX(${currentPositionSlider + (walk * 1.5)}px)`;
  });

  sliderListElement.addEventListener(`touchend`, (evt) => {
    endPos = Math.ceil(evt.changedTouches[0].clientX + walk);

    if (endPos > startX) {
      changeCurrentPosition(Direction.LEFT);
    } else {
      changeCurrentPosition(Direction.RIGHT);
    }
  });

  // Запрограмируем переключение слайдов по нажатию на кнопки
  if (leftBtnElement) {
    leftBtnElement.addEventListener(`click`, () => changeCurrentPosition(Direction.LEFT));
  }

  if (rightBtnElement) {
    rightBtnElement.addEventListener(`click`, () => changeCurrentPosition(Direction.RIGHT));
  }

  // Функции которые генерят и аппендят тогглы
  const generateMarkupToggle = (status) => {
    return (`<li class="slider-toggles__item" data-toggle-status="${status}"></li>`);
  };

  const appendToggles = (quantity, containerToggles) => {
    if (containerToggles.children.length === 0) {
      for (let i = 0; i < quantity; i++) {
        if (i === 0) {
          containerToggles.append(createElement(generateMarkupToggle(`active`)));
        }
        containerToggles.append(createElement(generateMarkupToggle(`none`)));
      }
    }
  };

  appendToggles(hiddenCards, togglesContainerElement);

  this.reloadSlider = function () {
    // Нужно удалить стили у контейнера с товарами (Чтобы вернуть его на 1-ую карточку)
    sliderListElement.removeAttribute(`style`);

    // След. шаг - это удалить элементы тогглов
    while (togglesContainerElement.firstChild) {
      togglesContainerElement.removeChild(togglesContainerElement.firstChild);
    }

    appendToggles(hiddenCards, togglesContainerElement);
    hideShowBtns();
  };
}
