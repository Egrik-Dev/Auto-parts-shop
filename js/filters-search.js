import { LargeSelectionFilter } from "./large-selection-filter.js";

export class FiltersSearch extends LargeSelectionFilter {
  constructor(container, items) {
    super(container, items);

    this.input = container.querySelector(`[data-search="input"]`);
    this.filterItems = this._filterItems.bind(this);

    this.input.addEventListener(`input`, this.filterItems);
  }

  _filterItems(evt) {
    const searchQuery = evt.target.value;

    // Если поисковой запрос пустой то отрисовываем стартовые элементы
    if (searchQuery === ``) {
      this._deleteAllItems();
      this.init();
    } else {
      const filteredArr = this.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this._deleteAllItems();
      this._renderItems(filteredArr);

      if (this.btnMore) {
        this._deleteShowMoreButton();
      }

      this._fixedHeightContainer();
    }
  }

  _deleteAllItems() {
    this.renderedItems.forEach((item) => item.remove());
    this.renderedItems = [];
  }
}
