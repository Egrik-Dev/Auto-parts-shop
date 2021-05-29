export function makeMenuToggle(container) {
  const MenuStatus = {
    CLOSED: `closed`,
    OPENED: `opened`,
  };

  const MakeOpenableMenu = function (mainContainer) {
    this.container = mainContainer;
    this.arrow = mainContainer.querySelector(`[data-menu="arrow"]`);
    this.innerContaier = this.container.querySelector(
      `[data-menu="inner-container"]`
    );
    this.startHeightContainer = 0;
    this.fullHeightContainer = ``;
    this.status = this.innerContaier.dataset.menuStatus;

    this.calculateFullHeight();
  };

  MakeOpenableMenu.prototype.calculateFullHeight = function () {
    if (this.status === MenuStatus.OPENED) {
      this.fullHeightContainer = this.innerContaier.offsetHeight;
      this.startHeightContainer = this.innerContaier.offsetHeight;
    } else {
      this.innerContaier.dataset.menuStatus = MenuStatus.OPENED;
      this.fullHeightContainer = this.innerContaier.offsetHeight;
      this.innerContaier.dataset.menuStatus = MenuStatus.CLOSED;
    }
  };

  MakeOpenableMenu.prototype.setHeight = function () {
    this.innerContaier.style.height = `${this.startHeightContainer}px`;
  };

  MakeOpenableMenu.prototype.toggledContainer = function () {
    return new Promise((resolve) => {
      if (this.innerContaier.dataset.menuStatus === MenuStatus.CLOSED) {
        this.innerContaier.style.height = `${this.fullHeightContainer}px`;
        this.innerContaier.dataset.menuStatus = MenuStatus.OPENED;
        this.innerContaier.classList.remove(`visually-hidden`);

        // Переворачиваем стрелочку
        this.arrow.style = `transform: rotate(180deg);`;
      } else {
        this.fullHeightContainer = this.innerContaier.offsetHeight;
        this.innerContaier.style.height = `0px`;
        this.arrow.style = `transform: rotate(0deg);`;
      }

      const endTransition = () => {
        this.innerContaier.removeEventListener(`transitionend`, endTransition);
        resolve(this.innerContaier);
      };

      this.innerContaier.addEventListener(`transitionend`, endTransition);
    });
  };

  const filterMenu = new MakeOpenableMenu(container);
  filterMenu.setHeight();
  const arrow = container.querySelector(`[data-menu="arrow"]`);
  arrow.addEventListener(`click`, () => {
    filterMenu.toggledContainer().then((innerContainer) => {
      if (innerContainer.offsetHeight === 0) {
        innerContainer.dataset.menuStatus = MenuStatus.CLOSED;
        innerContainer.classList.add(`visually-hidden`);
      }
    });
  });
}
