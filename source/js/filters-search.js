import {createElement} from './utils.js';

// TODO:
// Отмеченные инпуты не удаляются при взаиодействии с поиском, а отрисовываются вначале списка
// В класс отвечающий за поиск в фильтрах передаётся массив с объектами значений
// При отрисовке сначала отображаются Checked элементы, а после них unchecked
// При клике по инпуту изменяется его буелво значение в списке из пункта выше

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
    this.QUANTITY_RENDER_ITEMS = 4;
    this.startRenderedItems = this.items.slice(0, this.QUANTITY_RENDER_ITEMS);
    this.renderedItems = [];
    this.checkedItems = [];
    this.fullHeightContainer = null;

    this._renderShowMoreButton();
    this.renderItems(this.startRenderedItems);
    this._fixedHeightContainer();
    this.inputChange();

    this.renderNewItems = null;
    this.filterItems = null;
  }

  setInputClickHandler(input) {
    input.addEventListener(`mousedown`, () => {
      const checkboxElement = input.querySelector(`input`);
      if (!checkboxElement.checked) {
        this.checkedItems.push(input);
      }
    });
  }

  _fixedHeightContainer() {
    this.innerContaier.style.height = null;
    this.fullHeightContainer = this.innerContaier.offsetHeight;
    this.innerContaier.style.height = `${this.fullHeightContainer}px`;
  }

  _renderNewItems() {
    const newRenderedItems = this.items.slice(this.renderedItems.length, this.renderedItems.length + this.QUANTITY_RENDER_ITEMS);

    this.renderItems(newRenderedItems);
    this._fixedHeightContainer();
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
    this.btnMore = null;
  }

  // _resetHeight() {
  //   this.innerContaier.style.height = null;
  // }


  // setHeight() {
  //   this.fullHeightContainer = this.innerContaier.offsetHeight;
  //   this.innerContaier.style.height = `${this.fullHeightContainer}px`;
  // }

  renderItems(arrItems) {
    arrItems.forEach((item) => {
      const attributes = this._generateАttributeTitles(item);
      const itemList = createElement(this.generateMarkupItems(attributes));

      this.renderedItems.push(itemList);
      this.setInputClickHandler(itemList, this.setHandler);

      // Сравниваем кол-во отрисованых элементов с общим кол-ом
      if (this.renderedItems.length >= this.items.length) {
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
      this._renderShowMoreButton();
      this._fixedHeightContainer();
    } else {
      const filteredArr = this.items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
      this.deleteAllItems();
      this.renderItems(filteredArr);

      if (this.btnMore !== null) {
        this._deleteShowMoreButton();
      }

      this._fixedHeightContainer();
    }
  }

  inputChange() {
    this.filterItems = this._filterItems.bind(this);
    this.input.addEventListener(`input`, this.filterItems);
  }

  deleteAllItems() {
    this.renderedItems.forEach((item) => item.remove());
    this.renderedItems = [];
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
