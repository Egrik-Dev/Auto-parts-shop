import {MakeSlider} from "./slider.js";

const moreContainer = document.querySelector(`[data-slider-name="more"]`);
const catalogMoreSlider = new MakeSlider(moreContainer, `adaptive`);
catalogMoreSlider.init();
