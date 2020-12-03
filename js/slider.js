// Добавим импорты
import {createElement} from './utils.js';
import {disableBodyScroll, enableBodyScroll} from './bodyScrollLock.es6.js';

export function MakeSlider(container, mode, isTimer = `no`, delay) {
  // Создадим пустой объект без прототипа
  const Direction = Object.create(null);
  Direction.LEFT = `left`;
  Direction.RIGHT = `right`;

  const Mode = {
    LOOP: `loop`,
    ADAPTIVE: `adaptive`
  };
  const Flag = {
    YES: `yes`,
    NO: `no`
  };

  const slideElement = container.querySelector(`[data-slider="slide"]`);
  this.sliderListElement = container.querySelector(`[data-slider="list"]`); // Список с слайдами
  this.togglesContainerElement = container.querySelector(`[data-toggle="list"]`);
  const leftBtnElement = container.querySelector(`[data-side="left"]`);
  const rightBtnElement = container.querySelector(`[data-side="right"]`);
  const GAP = Number(getComputedStyle(slideElement).marginRight.split(``).slice(0, -2).join(``));
  this.widthSlide = slideElement.offsetWidth; // Ширина слайда
  this.sliderSize = this.widthSlide + GAP; // Общий размер карточки
  this.container = container;

  // Запускаем фунцкию для стартового подсчёта
  this.calculateSliderData();

  // Функция которая меняет значения текущей позиции слайдера и тоггла
  const changeCurrentPosition = (direction) => {
    switch (direction) {
      case Direction.LEFT:
        this.currentPositionSlider += this.sliderSize;
        this.currentPositionCircle -= 1;
        break;
      case Direction.RIGHT:
        this.currentPositionSlider -= this.sliderSize;
        this.currentPositionCircle += 1;
        break;
    }

    makeSwitching();
  };

  // Запрограммируем работу слайдера по таймеру
  if (isTimer === Flag.YES) {
    setInterval(changeCurrentPosition, delay, Direction.RIGHT);
  }

  const goToFirstSlide = () => {
    this.sliderListElement.style.transform = `translateX(0px)`;
    this.currentPositionSlider = 0;
    this.currentPositionCircle = 0;
  };

  const goToLastSlide = () => {
    this.sliderListElement.style.transform = `translateX(-${this.maxWidthSlider}px)`;
    this.currentPositionSlider = -this.maxWidthSlider;
    this.currentPositionCircle -= 1;
  };

  const switchSLide = () => {
    this.sliderListElement.style.transform = `translateX(${this.currentPositionSlider}px)`;
  };

  // Напишем функцию которая переключает активный тогл
  const changeActiveToggle = () => {
    let activeElement = this.togglesContainerElement.querySelector(`[data-toggle-status="active"]`);
    activeElement.dataset.toggleStatus = `none`;
    this.togglesContainerElement.children[this.currentPositionCircle].dataset.toggleStatus = `active`;
  };

  const hideSideButton = (btn) => {
    btn.style.opacity = `0`;
    btn.style.pointerEvents = `none`;
  };

  const showSideButton = (btn) => {
    btn.style.opacity = `1`;
    btn.style.pointerEvents = `auto`;
  };

  this.hideShowBtns = () => {
    // Убираем кнопку влево вначале, если слайдер Адаптивный
    if (mode === Mode.ADAPTIVE) {
      hideSideButton(leftBtnElement);

      // Убираем кнопку вправо если товаров меньше 4
      if (this.QUANTITY_SLIDES < 5) {
        hideSideButton(rightBtnElement);
      } else {
        showSideButton(rightBtnElement);
      }
    }
  };

  this.hideShowBtns();

  const makeSwitching = () => {
    switch (mode) {
      case Mode.LOOP:
        if (this.currentPositionSlider < -this.maxWidthSlider || this.currentPositionSlider > 0) {
          goToFirstSlide();
        } else {
          switchSLide();
        }
        break;
      case Mode.ADAPTIVE:
        if (this.currentPositionSlider < -this.maxWidthSlider) {
          goToLastSlide();
        } else if (this.currentPositionSlider > 0) {
          goToFirstSlide();
        } else {
          switchSLide();
          showSideButton(rightBtnElement);
          showSideButton(leftBtnElement);
        }

        if (this.currentPositionSlider === -this.maxWidthSlider) {
          hideSideButton(rightBtnElement);
        }

        if (this.currentPositionSlider === 0) {
          hideSideButton(leftBtnElement);
        }
        break;
    }

    this.sliderListElement.style.transition = `0.3s linear`;
    changeActiveToggle();
  };

  const swipe = () => {
    // Реализуем работу слайдера по свайпу с телефонов
    let startX;
    let startY;
    let walkX;
    let walkY;
    let endPos;
    let isSwiping = false;
    let isVerticalScroll = false;

    this.sliderListElement.addEventListener(`touchstart`, (evt) => {
      startX = Math.ceil(evt.touches[0].clientX);
      startY = Math.ceil(evt.touches[0].clientY);
    });

    this.sliderListElement.addEventListener(`touchmove`, (evt) => {
      walkY = Math.ceil(evt.touches[0].clientY) - startY;
      walkX = Math.ceil(evt.touches[0].clientX) - startX;

      if (isVerticalScroll) {
        this.sliderListElement.style.touchAction = `pan-y`;
      } else if (isSwiping) {
        disableBodyScroll(this.sliderListElement);
        this.sliderListElement.style.transition = `0ms linear`;
        this.sliderListElement.style.transform = `translateX(${this.currentPositionSlider + (walkX * 1.5)}px)`;
      } else if (walkY > 3 || walkY < -3) {
        isVerticalScroll = true;
      } else {
        isSwiping = true;
      }
    });

    this.sliderListElement.addEventListener(`touchend`, (evt) => {
      endPos = Math.ceil(evt.changedTouches[0].clientX + walkX);

      if (endPos > startX && isSwiping) {
        changeCurrentPosition(Direction.LEFT);
      } else if (endPos < startX && isSwiping) {
        changeCurrentPosition(Direction.RIGHT);
      }

      enableBodyScroll(this.sliderListElement);
      isSwiping = false;
      isVerticalScroll = false;
      this.sliderListElement.style.touchAction = `auto`;
    });
  };

  swipe();

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

  this.appendToggles = (quantity, containerToggles) => {
    if (containerToggles.children.length === 0) {
      for (let i = 0; i < quantity; i++) {
        if (i === 0) {
          containerToggles.append(createElement(generateMarkupToggle(`active`)));
        }
        containerToggles.append(createElement(generateMarkupToggle(`none`)));
      }
    }
  };

  this.appendToggles(this.hiddenCards, this.togglesContainerElement);
}

MakeSlider.prototype.calculateSliderData = function () {
  const widthContainer = this.container.querySelector(`[data-slider="container"]`).offsetWidth;
  const visibleCards = Math.round(widthContainer / this.widthSlide); // Количество видимых карточек
  this.QUANTITY_SLIDES = this.container.querySelectorAll(`[data-slider="slide"]`).length; // Всего слайдов
  this.currentPositionSlider = 0;
  this.currentPositionCircle = 0;
  this.hiddenCards = this.QUANTITY_SLIDES - visibleCards; // Количество скрытых карточек
  this.maxWidthSlider = this.hiddenCards * this.sliderSize; // Оставшаяся ширина контейнера
};

MakeSlider.prototype.reloadSlider = function () {
  // Нужно удалить стили у контейнера с товарами (Чтобы вернуть его на 1-ую карточку)
  this.sliderListElement.removeAttribute(`style`);

  // След. шаг - это удалить элементы тогглов
  while (this.togglesContainerElement.firstChild) {
    this.togglesContainerElement.removeChild(this.togglesContainerElement.firstChild);
  }

  this.appendToggles(this.hiddenCards, this.togglesContainerElement);
  this.hideShowBtns();
};
