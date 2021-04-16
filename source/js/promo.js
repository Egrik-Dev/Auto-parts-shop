import {createElement} from "./utils.js";
import {MakeSlider} from "./slider.js";

// -- ТАЙМЕР ОБРАТНОГО ОТСЧЁТА --
const makeTimer = (element, time) => {
  // Для начала сократим название товара
  const titleElement = element.querySelector(`.promo__timer-title`);
  const MAX_SYMBOLS = 13;

  if (titleElement.innerHTML.length > MAX_SYMBOLS) {
    const trimmedTitle = titleElement.innerHTML
      .split(``)
      .slice(0, MAX_SYMBOLS)
      .join(``);
    titleElement.innerHTML = trimmedTitle + `...`;
  }

  // Функция изменения промо карточки
  const changeDataCard = () => {
    const promoBlockElement = element.querySelector(
        `.promo__timer-price-block`
    );
    const textElement = element.querySelector(`.promo__timer-text`);
    const promoPriceBlockElement = element.querySelector(
        `.promo__timer-price-item--old`
    );
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
    // Функция вычитания 1 единицы измерения
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

    const secondsElement = element.querySelector(
        `.promo__timer-number--seconds`
    );
    const minutesElement = element.querySelector(
        `.promo__timer-number--minutes`
    );
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
        minutes = 59;
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

const addDays = 1;
const dateTommorow = new Date();
dateTommorow.setDate(dateTommorow.getDate() + addDays);

// Предположим что данные о акционных товарах мы получаем с сервера
const promoProducts = [
  {
    title: `Лампочка mini Ильича-Боровича`,
    url: `promo-bulb.html`,
    photo: `img/promo-bulb.jpg`,
    newPrice: 200,
    oldPrice: 500,
    dateEnd: dateTommorow,
  },
  {
    title: `Ремень ГРМ`,
    url: `promo-belt.html`,
    photo: `img/promo-belt.png`,
    newPrice: 800,
    oldPrice: 1500,
    dateEnd: new Date(),
  },
  {
    title: `Шина 205/80 R16 104Q Misha RF Power Grum`,
    url: `promo-tyre.html`,
    photo: `img/promo-tyre.png`,
    newPrice: 8500,
    oldPrice: 11500,
    dateEnd: dateTommorow,
  },
];

// Теперь напишем разметку которую мы будем аппендить на сайт
const generateMarkupPromo = (product) => {
  const {title, url, photo, newPrice, oldPrice} = product;

  return `<li class="prommo__timer-item" data-slider="slide">
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
</li>`;
};

// Функция для рассчёта оставшегося времени акции
const countRemainingTime = (date) => {
  const nowTimeStamp = Date.now();

  const dateTimeStamp = Date.parse(date);
  const differ = dateTimeStamp - nowTimeStamp;

  const time = {
    HOURS: Math.floor(differ / 1000 / 60 / 60),
    MINUTES: Math.floor((differ / 1000 / 60) % 60),
    SECONDS: Math.floor((differ / 1000) % 60),
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

// Флаг на работу таймера
const isTimer = {
  YES: `yes`,
  NO: `no`,
};

// Запускаем первый слайдер
const firstSliderContainer = document.querySelector(`.promo__slider-block`);
const FIRST_SLIDER_DELAY = 50000;
const firstPromoSlider = new MakeSlider(
    firstSliderContainer,
    `loop`,
    isTimer.YES,
    FIRST_SLIDER_DELAY
);
firstPromoSlider.calculateSliderData();

// Запускаем промо слайдер
const secondSliderContainer = document.querySelector(`.promo__timer-block`);
const PROMO_SLIDER_DELAY = 80000;
const secondPromoSlider = new MakeSlider(
    secondSliderContainer,
    `loop`,
    isTimer.YES,
    PROMO_SLIDER_DELAY
);
secondPromoSlider.calculateSliderData();
