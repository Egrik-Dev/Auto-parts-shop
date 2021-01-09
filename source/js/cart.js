// import {createElement} from './utils.js';

export class MainCart {
  constructor(cart) {
    this.mainCart = cart;
    this.allProducts = [];
    this.totalQuantity = 0;
  }

  changeCart(product) {
    const index = this.allProducts.findIndex((good) => good.title === product.title);

    if (index === -1) {
      this.allProducts.push(product);
    } else {
      this.allProducts = [].concat(this.allProducts.slice(0, index), product, this.allProducts.slice(index + 1));
    }

    this._calculateTotalProducts();
  }

  addNewProduct(title, id) {
    const newProduct = {
      title,
      id,
      quantity: 1
    };

    this.allProducts.push(newProduct);
  }

  _calculateTotalProducts() {
    // Тут нужен метод reduce для суммирования кол-ва товаров в корзине
  }

  _generateMarkupCart() {
    return (`<div class="user-menu__quantity-block">
    <span class="user-menu__quantity-number">1</span>
  </div>`);
  }
}

// const goodsInCart = mainCart.querySelector(`.user-menu__quantity-number`);

// if (goodsInCart === null) {
//   mainCart.append(createElement(generateMarkupCart()));
// } else {
//   goodsInCart.innerHTML++;
// }
