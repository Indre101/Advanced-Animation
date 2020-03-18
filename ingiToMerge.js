import { GetJsonData } from "./modules/ImportJson.js";
import { AppendText } from "./modules/appendText.js";
import { AppendImg } from "./modules/appendImg.js";

let Stage = 1;
let Part = 0;
document.addEventListener("DOMContentLoaded", datacheck(0, 0));
document.addEventListener("DOMContentLoaded", listen);

function datacheck() {
  let data = GetJsonData(Stage, Part);
  AppendText(data);
  AppendImg(data);
}

let clickFunc = function() {
  if (this.dataset.what == "bottom" || this.dataset.what == "img") {
    // Stage++;
    Part++;
    datacheck();
  }
};
function listen() {
  const element = document.querySelectorAll(".click");
  element.forEach(e => {
    e.addEventListener("click", (e = clickFunc));
  });
}
