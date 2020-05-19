// -- СЛАЙДЕР --
const makeSlider = (sliderContainer, sliderList, toggleList, delay) => {
  const Direction = {
    LEFT: `left`,
    RIGHT: `right`
  };
  const QUANTITY_SLIDES = sliderList.children.length;
  const DESKTOP_WIDTH_WINDOW = 1170;
  const clientWidth = document.body.clientWidth;
  const sliderSize = sliderList.offsetWidth / QUANTITY_SLIDES;
  let currentPositionSlider = 0;
  let currentPositionCircle = 0;

  // Напишем функцию которая переключает активный тогл
  const changeActiveToggle = () => {
    let activeElement = toggleList.querySelector(`[data-toggle-status="active"]`);
    activeElement.dataset.toggleStatus = `none`;
    toggleList.children[currentPositionCircle].dataset.toggleStatus = `active`;
  };

  // Функция перемещения 1 слайда
  const changeSlide = (direction) => {
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

    if (currentPositionSlider === -sliderList.offsetWidth || currentPositionSlider > 0) {
      sliderList.style.transform = `translateX(0px)`;
      currentPositionSlider = 0;
      currentPositionCircle = 0;
    } else {
      sliderList.style.transform = `translateX(${currentPositionSlider}px)`;
    }

    sliderList.style.transition = `0.3s linear`;
    changeActiveToggle();
  };

  // Запрограммируем работу слайдера по таймеру
  setInterval(changeSlide, delay, Direction.RIGHT);

  // Реализуем работу слайдера по свайпу с телефонов
  if (clientWidth < DESKTOP_WIDTH_WINDOW) {
    let startX;
    let walk;
    let endPos;

    sliderList.addEventListener(`touchstart`, (evt) => {
      startX = Math.ceil(evt.touches[0].clientX);
    });

    sliderList.addEventListener(`touchmove`, (evt) => {
      walk = Math.ceil(evt.touches[0].clientX) - startX;
      sliderList.style.transition = `0ms linear`;
      sliderList.style.transform = `translateX(${currentPositionSlider + (walk * 1.5)}px)`;
    });

    sliderList.addEventListener(`touchend`, (evt) => {
      endPos = Math.ceil(evt.changedTouches[0].clientX + walk);

      if (endPos > startX) {
        changeSlide(Direction.LEFT);
      } else {
        changeSlide(Direction.RIGHT);
      }
    });
  }

  // Запрограмируем переключение слайдов по нажатию на кнопки
  const leftBtnElement = sliderContainer.querySelector(`.promo__slider-button--left`);
  const rightBtnElement = sliderContainer.querySelector(`.promo__slider-button--right`);

  if (leftBtnElement) {
    leftBtnElement.addEventListener(`click`, () => changeSlide(Direction.LEFT));
  }

  if (rightBtnElement) {
    rightBtnElement.addEventListener(`click`, () => changeSlide(Direction.RIGHT));
  }
};


// -- ТАЙМЕР ОБРАТНОГО ОТСЧЁТА --
const makeTimer = (element, time) => {
  // Для начала сократим название товара
  const titleElement = element.querySelector(`.promo__timer-title`);
  const MAX_SYMBOLS = 13;

  if (titleElement.innerHTML.length > MAX_SYMBOLS) {
    const trimmedTitle = titleElement.innerHTML.split(``).slice(0, MAX_SYMBOLS).join(``);
    titleElement.innerHTML = trimmedTitle + `...`;
  }

  // Функция изменения промо карточки
  const changeDataCard = () => {
    const promoBlockElement = element.querySelector(`.promo__timer-price-block`);
    const textElement = element.querySelector(`.promo__timer-text`);
    const promoPriceBlockElement = element.querySelector(`.promo__timer-price-item--old`);
    const promoPriceElement = element.querySelector(`.promo__timer-price--old`);
    const priceElement = element.querySelector(`.promo__timer-price`);
    textElement.innerHTML = `Акция завершена!`;
    priceElement.innerHTML = promoPriceElement.innerHTML;
    promoPriceBlockElement.remove();
    promoBlockElement.style.alignSelf = `center`;
  };

  // Сделаем условие - если дата оканчании акции уже наступила, то изменяем карточку и не запускаем таймер
  if (time.HOURS < 0) {
    changeDataCard();
  } else {
  // Функция вычитании 1 единицы измерения
    const subtractingOne = (unitTime) => {
      const oneUnitTime = 1;
      unitTime -= oneUnitTime;
      return unitTime;
    };

    // Функция изменения единицы времени в DOM элементе
    const changeTime = (unitTime, container) => {
      const twoSymbolsNumber = 0 + String(unitTime);
      container.innerHTML = `${twoSymbolsNumber.slice(-2)}`;
    };

    const secondsElement = element.querySelector(`.promo__timer-number--seconds`);
    const minutesElement = element.querySelector(`.promo__timer-number--minutes`);
    const hoursElement = element.querySelector(`.promo__timer-number--hours`);

    let seconds = time.SECONDS;
    let minutes = time.MINUTES;
    let hours = time.HOURS;
    changeTime(minutes, minutesElement);
    changeTime(hours, hoursElement);
    changeTime(seconds, secondsElement);

    const stopPromo = () => {
      clearInterval(timer);
      changeDataCard();
    };

    const timer = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        hours = subtractingOne(hours);
        changeTime(hours, hoursElement);
        minutes = 60;
      }

      if (seconds === 0) {
        minutes = subtractingOne(minutes);
        changeTime(minutes, minutesElement);
        seconds = 60;
      }

      seconds = subtractingOne(seconds);
      changeTime(seconds, secondsElement);

      if (hours === 0 && minutes === 0 && seconds === 0) {
        stopPromo();
      }
    }, 1000);
  }
};

// Предположим что данные о акционных товарах мы получаем с сервера
const promoProducts = [
  {
    title: `Лампочка mini Ильича-Боровича`,
    url: `promo-bulb.html`,
    photo: `img/promo-bulb.jpg`,
    newPrice: 200,
    oldPrice: 500,
    dateEnd: `2020-05-19T14:55:00`
  },
  {
    title: `Ремень ГРМ`,
    url: `promo-belt.html`,
    photo: `img/promo-belt.png`,
    newPrice: 800,
    oldPrice: 1500,
    dateEnd: `2020-05-20T10:00:00`
  },
  {
    title: `Шина 205/80 R16 104Q Misha RF Power Grum`,
    url: `promo-tyre.html`,
    photo: `img/promo-tyre.png`,
    newPrice: 8500,
    oldPrice: 11500,
    dateEnd: `2020-05-21T19:30:00`
  }
];

// Теперь напишем разметку которую мы будем аппендить на сайт
const generateMarkupPromo = (product) => {
  const {title, url, photo, newPrice, oldPrice} = product;

  return (`<li class="prommo__timer-item">
  <div class="promo__timer-good">
    <a class="promo__timer-good-link" href="${url}">
      <h3 class="promo__timer-title">${title}</h3>
    </a>
    <a class="promo__timer-good-link--img" href="${url}">
      <img class="promo__timer-img" src="${photo}" alt="Фото товара ${title}" width="150" height="187">
    </a>
    <ul class="promo__timer-price-block">
      <li class="promo__timer-price-item">
        <span class="promo__timer-price">${newPrice}</span>
        <svg class="promo__timer-rubble" width="14" height="17">
          <use xlink:href="img/sprite.svg#icon-rubble"></use>
        </svg>
      </li>
      <li class="promo__timer-price-item promo__timer-price-item--old">
        <span class="promo__timer-price promo__timer-price--old">${oldPrice}</span>
        <svg class="promo__timer-rubble promo__timer-rubble--old" width="11" height="13">
          <use xlink:href="img/sprite.svg#icon-rubble"></use>
        </svg>
      </li>
    </ul>
  </div>
  <div class="promo__timer-time">
    <p class="promo__timer-text">До конца акции осталось:</p>
    <div class="promo__timer-clock">
      <ul class="promo__timer-clock-list">
        <li class="promo__timer-number promo__timer-number--hours">00</li>
        <li class="promo__timer-caption">Часов</li>
      </ul>
      <span class="promo__timer-colon">:</span>
      <ul class="promo__timer-clock-list">
        <li class="promo__timer-number promo__timer-number--minutes">00</li>
        <li class="promo__timer-caption">Минут</li>
      </ul>
      <span class="promo__timer-colon">:</span>
      <ul class="promo__timer-clock-list">
        <li class="promo__timer-number promo__timer-number--seconds">00</li>
        <li class="promo__timer-caption">Секунд</li>
      </ul>
    </div>
  </div>
</li>`);
};

// Создаём контейнер для корректной вставки в HTML
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// Функция для рассчёта оставшегося времени акции
const countRemainingTime = (date) => {
  const nowTimeStamp = Date.now();
  const dateTimeStamp = Date.parse(date);
  const differ = dateTimeStamp - nowTimeStamp;
  const time = {
    HOURS: Math.floor(((differ / 1000) / 60) / 60),
    MINUTES: Math.round(((differ / 1000) / 60) % 60),
    SECONDS: Math.round((differ / 1000) % 60)
  };
  return time;
};


// ДОБАВИМ ЕЩЁ ТОВАРОВ ПО АКЦИИ
const promoContainerElement = document.querySelector(`.promo__timer-list`);

promoProducts.forEach((item, index) => {
  const time = countRemainingTime(item.dateEnd);
  promoContainerElement.append(createElement(generateMarkupPromo(item)));
  const promoElement = document.querySelectorAll(`.prommo__timer-item`);
  makeTimer(promoElement[index], time);
});

// Запускаем первый слайдер
const firstSliderContainer = document.querySelector(`.promo__slider`);
const sliderListElement = document.querySelector(`.promo__slider-list`);
const circlesElements = document.querySelector(`.promo__circles-list`);
const SLIDER_DELAY = 50000;
makeSlider(firstSliderContainer, sliderListElement, circlesElements, SLIDER_DELAY);

// Запускаем промо слайдер
const secondSliderContainer = document.querySelector(`.promo__timer-block`);
const sliderPromoListElement = document.querySelector(`.promo__timer-list`);
const circlesPromoElements = document.querySelector(`.promo-timer-toggles-list`);
const PROMO_SLIDER_DELAY = 8000;
makeSlider(secondSliderContainer, sliderPromoListElement, circlesPromoElements, PROMO_SLIDER_DELAY);
