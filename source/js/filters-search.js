import {createElement} from './utils.js';

// TODO:
// При наборе текста в поиск скрывать кнопку
// При удалении текста из поиска отображать стартовые 4 элемента и кнопку


export class FiltersSearch {
  constructor(container, items) {
    this.container = container;
    this.items = items;
    this.innerContaier = this.container.querySelector(`[data-menu="inner-container"]`);
    this.list = container.querySelector(`[data-search="list"]`);
    this.input = container.querySelector(`[data-search="input"]`);
    this.btnMore = null;
    this.titleList = this.list.dataset.listTitle;
    this.QUANTITY_RENDER_ITEMS = 4;
    this.startRenderedItems = this.items.slice(0, this.QUANTITY_RENDER_ITEMS);
    this.activeItems = [];
    this.fullHeightContainer = null;

    this._renderShowMoreButton();
    this.renderItems(this.startRenderedItems);
    this.setHeight();
    this.inputChange();

    this.renderNewItems = null;
    this.filterItems = null;
  }

  _renderNewItems() {
    const newRenderedItems = this.items.slice(this.activeItems.length, this.activeItems.length + this.QUANTITY_RENDER_ITEMS);

    this.renderItems(newRenderedItems);
    this._resetHeight();
    this.setHeight();
  }

  _renderShowMoreButton() {
    this.btnMore = createElement(this.generateMarkupShowMore());
    this.innerContaier.append(this.btnMore);
    this.renderNewItems = this._renderNewItems.bind(this);
    this.btnMore.addEventListener(`click`, this.renderNewItems);
  }

  _deleteShowMoreButton() {
    this.btnMore.removeEventListener(`click`, this.renderNewItems);
    this.btnMore.remove();
  }

  _resetHeight() {
    this.innerContaier.style.height = null;
  }

  setHeight() {
    this.fullHeightContainer = this.innerContaier.offsetHeight;
    this.innerContaier.style.height = `${this.fullHeightContainer}px`;
  }

  renderItems(arrItems) {
    arrItems.forEach((item) => {
      const attributes = this._generateАttributeTitles(item);
      const itemList = createElement(this.generateMarkupItems(attributes));
      this.activeItems.push(itemList);

      // Сравгиваем кол-во отрисованых элементов с общим кол-ом
      if (this.activeItems.length === this.items.length) {
        this._deleteShowMoreButton();
      }

      this.list.append(itemList);
    });
  }

  _filterItems(evt) {
    const searchQuery = evt.target.value;

    // Если поисковой запрос пустой то отрисовываем стартовые элементы
    if (searchQuery === ``) {
      this.deleteAllItems();
      this.renderItems(this.startRenderedItems);
    } else {
      const filteredArr = this.items.filter((item) => item.includes(searchQuery));
      console.log(filteredArr);
      this.deleteAllItems();
      this.renderItems(filteredArr);
    }
  }

  inputChange() {
    this.filterItems = this._filterItems.bind(this);
    this.input.addEventListener(`input`, this.filterItems);
  }

  deleteAllItems() {
    this.activeItems.forEach((item) => item.remove());
  }

  _generateАttributeTitles(item) {
    return {
      titleBrand: item,
      name: this.titleList,
      id: item.toLowerCase()
        .split(``)
        .map((letter) => letter === ` ` ? `-` : letter)
        .join(``)
    };
  }

  generateMarkupItems(attributes) {
    const {titleBrand, name, id} = attributes;
    return (`<li class="filters__form-item-wrap">
        <input class="filters__checkbox visually-hidden" type="checkbox" name="${name}" id="${id}-box" value="${id}">
        <label class="filters__checkbox-label" for="${id}-box">${titleBrand}</label>
      </li>
    `);
  }

  generateMarkupShowMore() {
    return (`<button class="filters__btn-more" type="button" name="btn-more">Показать еще</button>`);
  }
}
