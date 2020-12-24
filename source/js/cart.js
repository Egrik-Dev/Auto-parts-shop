import {createElement} from './utils.js';

const productElements = document.querySelectorAll(`.product`);
const mainCart = document.querySelector(`.user-menu__icons-item--cart a`);

productElements.forEach((product) => {
  const cart = product.querySelector(`.product__cart-btn`);
  if (cart) {
    cart.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const goodsInCart = mainCart.querySelector(`.user-menu__quantity-number`);

      if (goodsInCart === null) {
        mainCart.append(createElement(generateMarkupCart()));
      } else {
        goodsInCart.innerHTML++;
      }

      const priceElement = product.querySelector(`.product__price-block`);
      priceElement.classList.add(`product__price-block--cart`);
    });
  }
});

const generateMarkupCart = () => {
  return (`<div class="user-menu__quantity-block">
  <span class="user-menu__quantity-number">1</span>
</div>`);
};
