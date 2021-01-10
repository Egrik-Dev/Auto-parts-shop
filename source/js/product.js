import {MainCart} from './cart.js';

export class Product {
  constructor(container, id, mainCart) {
    this.container = container;
    this.id = id;
    this.mainCart = mainCart;

    this.title = this.container.querySelector(`.product__title`).textContent;
    this.cartProductBtn = container.querySelector(`.product__cart-btn`);
    this.priceElement = container.querySelector(`.product__price-block`);
    this.quantityBlockElement = container.querySelector(`.product__quantity-block`);
    this.minusBtnElement = this.quantityBlockElement.querySelector(`[data-product-quantity="minus"]`);
    this.plusBtnElement = this.quantityBlockElement.querySelector(`[data-product-quantity="plus"]`);
    this.quantityInputElement = this.quantityBlockElement.querySelector(`.prodcut__quantity-input`);

    this.addToCard = this._addToCard.bind(this);
    this.addOneItem = this._addOneItem.bind(this);
    this.removeOneItem = this._removeOneItem.bind(this);
    this.inputChange = this._inputChange.bind(this);

    this.minusBtnElement.addEventListener(`click`, this.removeOneItem);
    this.plusBtnElement.addEventListener(`click`, this.addOneItem);
    this.quantityInputElement.addEventListener(`input`, this.inputChange);
  }

  _addToCard(evt) {
    evt.preventDefault();

    this.priceElement.classList.add(`product__price-block--cart`);
    this._showQuantityBlock();
    this._addOneItem();
    this.cartProductBtn.disabled = true;

    this.mainCart.addNewProduct(this.title, this.id, Number(this.quantityInputElement.value));
  }

  _removeFromCart() {
    this.priceElement.classList.remove(`product__price-block--cart`);
    this._removeQuantityBlock();
    this.cartProductBtn.disabled = false;
    this.mainCart.removeProduct(this.id);
  }

  _inputChange() {
    this._checkMaxValue();
    this._checkMinValue();
    this.mainCart.recalcQuantity(this.id, Number(this.quantityInputElement.value));
  }

  _checkMaxValue() {
    if (Number(this.quantityInputElement.value) >= 99) {
      this.quantityInputElement.value = 99;
    }
  }

  _checkMinValue() {
    if (Number(this.quantityInputElement.value) <= 0) {
      this._removeFromCart();
    }
  }

  _addOneItem() {
    this.quantityInputElement.value++;

    this._checkMaxValue();
    this.mainCart.recalcQuantity(this.id, Number(this.quantityInputElement.value));
  }

  _removeOneItem() {
    this.quantityInputElement.value--;

    this._checkMinValue();
    this.mainCart.recalcQuantity(this.id, Number(this.quantityInputElement.value));
  }

  _showQuantityBlock() {
    this.quantityBlockElement.classList.add(`product__quantity-block--show`);
    this.cartProductBtn.classList.add(`product__cart-btn--added`);
  }

  _removeQuantityBlock() {
    this.quantityBlockElement.classList.remove(`product__quantity-block--show`);
    this.cartProductBtn.classList.remove(`product__cart-btn--added`);
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
    productElement.cartProductBtn.addEventListener(`click`, productElement.addToCard);
  }
});
