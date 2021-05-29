export class MainCart {
  constructor(cart) {
    this.mainCart = cart;
    this.allProducts = [];
    this.totalQuantity = 0;
    this.quantityBlockElement = cart.querySelector(
      `.user-menu__quantity-block`
    );
    this.quantityNumberElement = cart.querySelector(
      `.user-menu__quantity-number`
    );
  }

  addNewProduct(title, id, quantity) {
    const newProduct = { title, id, quantity };

    this.allProducts.push(newProduct);
    this._calculateTotalProducts();
    this._showTotalQuantity();
  }

  removeProduct(id) {
    const index = this.allProducts.findIndex((product) => product.id === id);
    this.allProducts = [].concat(
      this.allProducts.slice(0, index),
      this.allProducts.slice(index + 1)
    );
    this._removeTotalQuantity();
  }

  recalcQuantity(id, quantity) {
    this.allProducts.forEach((product) => {
      if (product.id === id) {
        product.quantity = quantity;
      }
    });

    this._calculateTotalProducts();
  }

  _calculateTotalProducts() {
    this.totalQuantity = this.allProducts.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    if (this.totalQuantity > 99) {
      this.quantityNumberElement.textContent = `99+`;
    } else {
      this.quantityNumberElement.textContent = this.totalQuantity;
    }
  }

  _showTotalQuantity() {
    if (this.allProducts.length > 0) {
      this.quantityBlockElement.classList.add(
        `user-menu__quantity-block--show`
      );
    }
  }

  _removeTotalQuantity() {
    if (this.allProducts.length === 0) {
      this.quantityBlockElement.classList.remove(
        `user-menu__quantity-block--show`
      );
    }
  }
}
