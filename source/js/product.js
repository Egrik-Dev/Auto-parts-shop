import {MainCart} from './cart.js';

// TODO:

export class Product {
  constructor(container, id, mainCart) {
    this.container = container;
    this.id = id;
    this.mainCart = mainCart;

    this.title = this.container.querySelector(`.product__title`).textContent;
    this.cartProductBtn = container.querySelector(`.product__cart-btn`);
    this.priceElement = container.querySelector(`.product__price-block`);
    this.quantityElement = container.querySelector(`.product__quantity-block`);

    this.addToCard = this._addToCard.bind(this);

    this.cartProductBtn.addEventListener(`click`, this.addToCard);
  }

  _addToCard(evt) {
    evt.preventDefault();

    this.priceElement.classList.add(`product__price-block--cart`);
    this.quantityElement.classList.add(`product__quantity-block--show`);
    this.cartProductBtn.classList.add(`product__cart-btn--added`);
    this.cartProductBtn.disabled = true;

    this.mainCart.addNewProduct(this.title, this.id);
  }
}

const cartElement = document.querySelector(`.user-menu__icons-item--cart`);
const mainCart = new MainCart(cartElement);
const productElements = document.querySelectorAll(`.product`);

productElements.forEach((product, index) => {
  const cart = product.querySelector(`.product__cart-btn`);
  if (cart) {
    // Так как у товаров нет уникального id, передаём его индекс
    const productElement = new Product(product, index, mainCart);
  }
});
