import {createElement} from './utils.js';

const QUANTITY_RENDER_ITEMS = 4;

// TODO:
// Произведен рефакторинг класса отвечающего за поиск в фильтрах

export class FiltersSearch {
  constructor(container, items) {
    this.container = container;
    this.items = items;
    this.innerContaier = this.container.querySelector(`[data-menu="inner-container"]`);
    this.list = container.querySelector(`[data-search="list"]`);
    this.input = container.querySelector(`[data-search="input"]`);
    this.btnMore = null;
    this.titleList = this.list.dataset.listTitle;
    this.renderedItems = [];
    this.fullHeightContainer = null;
    this.renderNewItems = this._renderNewItems.bind(this);
    this.filterItems = this._filterItems.bind(this);

    this.input.addEventListener(`input`, this.filterItems);
  }

  init() {
    this._renderShowMoreButton();
    this._sortArrItems();
    this._renderItems(this._createStartRenderItems());
    this._fixedHeightContainer();
  }

  _renderShowMoreButton() {
    this.btnMore = createElement(this.generateMarkupShowMore());
    this.innerContaier.append(this.btnMore);
    this.btnMore.addEventListener(`click`, this.renderNewItems);
  }

  _sortArrItems() {
    this.items.sort((a, b) => b.isChecked - a.isChecked);
  }

  _renderItems(arrItems) {
    arrItems.forEach((item) => {
      const attributes = this._generateАttributeTitles(item);
      const itemList = createElement(this.generateMarkupItems(attributes));

      this.renderedItems.push(itemList);
      this.setInputClickHandler(itemList, item);

      // Сравниваем кол-во отрисованых элементов с общим кол-ом
      if (this.renderedItems.length >= this.items.length) {
        this._deleteShowMoreButton();
      }

      this.list.append(itemList);
    });
  }

  _fixedHeightContainer() {
    this.innerContaier.style.height = null;
    this.fullHeightContainer = this.innerContaier.offsetHeight;
    this.innerContaier.style.height = `${this.fullHeightContainer}px`;
  }


  // FIXME:
  // Исправить itemmm
  setInputClickHandler(input, item) {
    input.addEventListener(`mousedown`, () => {
      this.items.forEach((itemmm) => {
        if (itemmm.name === item.name) {
          itemmm.isChecked = !itemmm.isChecked;
        }
      });
    });
  }

  _createStartRenderItems() {
    const arrItems = this.items.filter((item) => item.isChecked);
    if (this.items.length >= QUANTITY_RENDER_ITEMS && arrItems.length < QUANTITY_RENDER_ITEMS) {
      while (arrItems.length !== QUANTITY_RENDER_ITEMS) {
        arrItems.push(this.items[arrItems.length]);
      }
    } else if (this.items.length < QUANTITY_RENDER_ITEMS) {
      return this.items;
    }

    return arrItems;
  }

  _renderNewItems() {
    const newRenderedItems = this.items.slice(this.renderedItems.length, this.renderedItems.length + QUANTITY_RENDER_ITEMS);

    this._renderItems(newRenderedItems);
    this._fixedHeightContainer();
  }

  _deleteShowMoreButton() {
    this.btnMore.removeEventListener(`click`, this.renderNewItems);
    this.btnMore.remove();
    this.btnMore = null;
  }

  _filterItems(evt) {
    const searchQuery = evt.target.value;

    // Если поисковой запрос пустой то отрисовываем стартовые элементы
    if (searchQuery === ``) {
      this.deleteAllItems();
      this._renderShowMoreButton();
      this._sortArrItems();
      this._renderItems(this._createStartRenderItems());
      this._fixedHeightContainer();
    } else {
      const filteredArr = this.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      this.deleteAllItems();
      this._renderItems(filteredArr);

      if (this.btnMore !== null) {
        this._deleteShowMoreButton();
      }

      this._fixedHeightContainer();
    }
  }

  deleteAllItems() {
    this.renderedItems.forEach((item) => item.remove());
    this.renderedItems = [];
  }

  _generateАttributeTitles(item) {
    return {
      titleBrand: item.name,
      name: this.titleList,
      checked: item.isChecked,
      id: item.name.toLowerCase()
        .split(``)
        .map((letter) => letter === ` ` ? `-` : letter)
        .join(``)
    };
  }

  generateMarkupItems(attributes) {
    const {titleBrand, name, id, checked} = attributes;
    return (`<li class="filters__form-item-wrap">
        <input class="filters__checkbox visually-hidden" type="checkbox" name="${name}" id="${id}-box" value="${id}" ${checked ? `checked` : ``}>
        <label class="filters__checkbox-label" for="${id}-box">${titleBrand}</label>
      </li>
    `);
  }

  generateMarkupShowMore() {
    return (`<button class="filters__btn-more" type="button" name="btn-more">Показать еще</button>`);
  }
}
