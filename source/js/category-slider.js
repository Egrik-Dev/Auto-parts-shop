import {MakeSlider} from './slider.js';
import {createElement} from './utils.js';

const popularContainer = document.querySelector(`[data-slider-name="popular"]`);
const moreContainer = document.querySelector(`[data-slider-name="more"]`);
const popularProductsSlider = new MakeSlider(popularContainer, `adaptive`);
const moreProductsSlider = new MakeSlider(moreContainer, `adaptive`);
popularProductsSlider.init();
moreProductsSlider.init();

// Создадим мапу с всеми категориями
const CategoryType = {
  SPARES: `spares`,
  AUTOCHEMISTRY: `autochemistry`,
  TYRES: `tyres`,
  ELECTRONICS: `electronics`,
  TOOLS: `tools`,
  ACCESSORIES: `accessories`
};

// Объявим переменную текущей категории
let currentCategory = CategoryType.SPARES;

const Features = {
  popular: {
    url: `img/sprite.svg#icon-heart`,
    desc: `Популярная модель`,
    sizesImg: {
      width: 27,
      height: 25
    }
  },
  snowflake: {
    url: `img/sprite.svg#icon-snowflake`,
    desc: `Для зимы`,
    sizesImg: {
      width: 38,
      height: 31
    }
  },
  sun: {
    url: `img/sprite.svg#icon-sun`,
    desc: `Для летнего времени года`,
    sizesImg: {
      width: 31,
      height: 31
    }
  },
};

// Предположим что данные о товарах категорий мы получаем с сервера
const categoriesProducts = {
  SPARES:
  {
    url: `category/spares.html`,
    products: [
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      },
      {
        title: `Шина 205/80 R16 104Q Misha RF Power Grum`,
        url: `product-2.html`,
        photo: `img/product-tyre.png`,
        photoSize: {
          width: 151,
          height: 181
        },
        stock: true,
        price: 11680,
        sticker: true,
        features: [Features.popular, Features.snowflake]
      },
      {
        title: `Фара Nokian 2025`,
        url: `product-3.html`,
        photo: `img/product-headlight.png`,
        photoSize: {
          width: 232,
          height: 174
        },
        stock: true,
        price: 680,
        sticker: false,
        features: [Features.popular]
      },
      {
        title: `Шина 245/60 R18 105T Contyther Crosh Contanital`,
        url: `product-4.html`,
        photo: `img/product-tyre-2.png`,
        photoSize: {
          width: 151,
          height: 181
        },
        stock: false,
        price: 19200,
        sticker: true,
        features: [Features.popular, Features.sun]
      },
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      },
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      }
    ]
  },
  AUTOCHEMISTRY:
  {
    url: `category/autochemistry.html`,
    products: [
      {
        title: `AVS Crystal Автошампунь`,
        url: `product-5.html`,
        photo: `img/product-autochemistry.jpg`,
        photoSize: {
          width: 160,
          height: 213
        },
        stock: true,
        price: 720,
        sticker: true,
        features: [Features.popular]
      },
      {
        title: `AVS Crystal WAX Автошампунь`,
        url: `product-6.html`,
        photo: `img/product-autochemistry-2.jpg`,
        photoSize: {
          width: 600,
          height: 600
        },
        stock: true,
        price: 850,
        sticker: true,
        features: [Features.popular]
      },
      {
        title: `Karcher Insect Remover`,
        url: `product-7.html`,
        photo: `img/product-autochemistry-3.jpg`,
        photoSize: {
          width: 1500,
          height: 1500
        },
        stock: false,
        price: 690,
        sticker: true,
        features: [Features.popular, Features.sun, Features.snowflake]
      }
    ]
  },
  TYRES:
  {
    url: `category/tyres.html`,
    products: [
      {
        title: `Шина 205/80 R16 104Q Misha RF Power Grum`,
        url: `product-2.html`,
        photo: `img/product-tyre.png`,
        photoSize: {
          width: 151,
          height: 181
        },
        stock: true,
        price: 11680,
        sticker: true,
        features: [Features.popular, Features.snowflake]
      },
      {
        title: `Шина 245/60 R18 105T Contyther Crosh Contanital`,
        url: `product-4.html`,
        photo: `img/product-tyre-2.png`,
        photoSize: {
          width: 151,
          height: 181
        },
        stock: false,
        price: 19200,
        sticker: true,
        features: [Features.popular, Features.sun]
      },
      {
        title: `Шина 205/80 R16 104Q Misha RF Power Grum`,
        url: `product-2.html`,
        photo: `img/product-tyre.png`,
        photoSize: {
          width: 151,
          height: 181
        },
        stock: true,
        price: 11680,
        sticker: true,
        features: [Features.popular, Features.snowflake]
      },
      {
        title: `Шина 245/60 R18 105T Contyther Crosh Contanital`,
        url: `product-4.html`,
        photo: `img/product-tyre-2.png`,
        photoSize: {
          width: 151,
          height: 181
        },
        stock: false,
        price: 19200,
        sticker: true,
        features: [Features.popular, Features.sun]
      },
      {
        title: `Шина 205/80 R16 104Q Misha RF Power Grum`,
        url: `product-2.html`,
        photo: `img/product-tyre.png`,
        photoSize: {
          width: 151,
          height: 181
        },
        stock: true,
        price: 11680,
        sticker: true,
        features: [Features.popular, Features.snowflake]
      }
    ]
  },
  ELECTRONICS:
  {
    url: `category/electronics.html`,
    products: [
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      }
    ]
  },
  TOOLS:
  {
    url: `category/tools.html`,
    products: [
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      },
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      }
    ]
  },
  ACCESSORIES:
  {
    url: `category/accessories.html`,
    products: [
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      },
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      },
      {
        title: `Ремень`,
        url: `product-1.html`,
        photo: `img/promo-belt.png`,
        photoSize: {
          width: 230,
          height: 215
        },
        stock: true,
        price: 440,
        sticker: false,
        features: [Features.popular]
      }
    ]
  }
};

const generateMarkupFeature = (feature) => {
  return (`<li class="product__features-item">
    <span class="visually-hidden">${feature.desc}</span>
    <svg class="product__feature-img" width="${feature.sizesImg.width}" height="${feature.sizesImg.height}">
      <use xlink:href="${feature.url}"></use>
    </svg>
  </li>`);
};

const generateMarkupInStock = (url, price) => {
  return (`<a class="product__price-link" href="${url}">
    <span class="product__price">${price} ₽</span>
    </a>`);
};

const generateMarkupOutOfStock = () => {
  return (`<span class="product__out-of-stock-title">Нет в наличии</span>
  <a class="product__out-of-stock-link" href="#">Сообщить о поступлении</a>`);
};

const generateMarkupSteacker = () => {
  return (`<div class="product__sticker">
    <span class="product__sticker-word">Sale</span>
  </div>`);
};

const generateMarkupCart = () => {
  return (`<a class="product__cart-link" href="cart.html">
    <button class="product__cart-btn" type="submit">
      <span class="visually-hidden">Купить</span>
    </button>
  </a>`);
};

const generateMarkupProduct = (product) => {
  const {title, url, photo, photoSize, stock, price, sticker, features} = product;

  return (`<li class="category-slider__goods-item product" data-slider="slide">
    ${sticker ? generateMarkupSteacker() : ``}
    <ul class="product__features-list">
    ${features.map((feature) => generateMarkupFeature(feature))
      .join(``)}
    </ul>
    <a class="product__img-link" href="${url}">
      <img class="product__img" src="${photo}" alt="Фото товара ${title}" width="${photoSize.width}" height="${photoSize.height}">
    </a>
    <a class="product__title-link" href="${url}">
      <h3 class="product__title">${title}</h3>
    </a>
    <div class="product__price-block">
      ${stock ? generateMarkupInStock(url, price) : generateMarkupOutOfStock()}
    </div>
      ${stock ? generateMarkupCart() : ``}
    <div class="product__quick-view-block">
      <a class="product__quick-view-link" href="product-1-mini.html">Быстрый просмотр</a>
    </div>
  </li>`);
};

const switchCategories = (container, slider) => {
  const categoriesElements = container.querySelectorAll(`.category-slider__category-item`);
  categoriesElements.forEach((item) => {
    item.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (item.dataset.category !== currentCategory) {
        // Переключаем активную текущую категорию
        const preventCategory = container.querySelector(`.category-slider__category-item--checked`);
        preventCategory.classList.remove(`category-slider__category-item--checked`);
        item.classList.add(`category-slider__category-item--checked`);

        // Удаляем все карточки
        const productsAllElements = container.querySelectorAll(`.category-slider__goods-item`);
        productsAllElements.forEach((product) => product.remove());

        // Берем массив с карточками и рендерим их
        const currentArrProducts = categoriesProducts[item.dataset.category.toUpperCase()].products;
        const goodsContainerElement = container.querySelector(`.category-slider__goods-list`);
        currentArrProducts.forEach((product) => {
          goodsContainerElement.append(createElement(generateMarkupProduct(product)));
        });

        // Перезапускаем работу слайдера с новыми данными
        slider.calculateSliderData();
        slider.reloadSlider();

        // Вставляем новую ссылку в кнопку "Смотреть ещё"
        const showMoreBtn = container.querySelector(`.more-btn`);
        showMoreBtn.setAttribute(`href`, categoriesProducts[item.dataset.category.toUpperCase()].url);

        currentCategory = item.dataset.category;
      }
    });
  });
};

switchCategories(popularContainer, popularProductsSlider);
switchCategories(moreContainer, moreProductsSlider);
