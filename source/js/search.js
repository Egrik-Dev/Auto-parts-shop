const categoryRadioElements = document.querySelectorAll(`.search__input-radio`);
const fieldSearchElement = document.querySelector(`.search__input-search`);

const changeSearchPlaceholder = (id) => {
  switch (id) {
    case `vin`:
      fieldSearchElement.placeholder = `Введите Vin номер`;
      break;
    case `brand`:
      fieldSearchElement.placeholder = `Введите марку автомобиля`;
      break;
    case `title`:
      fieldSearchElement.placeholder = `Введите название товара`;
      break;
    case `article`:
      fieldSearchElement.placeholder = `Введите артикул детали`;
      break;
  }
};

categoryRadioElements.forEach((item) => {
  item.addEventListener(`change`, () => changeSearchPlaceholder(item.id));
});
