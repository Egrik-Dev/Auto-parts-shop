const labels = document.querySelectorAll(`.filters__label`);

labels.forEach((label) => {
  label.addEventListener(`click`, () => {
    console.log(`Нажали Label`);
  });
});
