import { GetJsonData } from "./modules/ImportJson.js";
import { AppendText } from "./modules/appendText.js";
import { AppendImg } from "./modules/appendImg.js";

let Stage = 0;
let Part = 0;

document.addEventListener("DOMContentLoaded", datacheck(1, 0));
document.addEventListener("DOMContentLoaded", listen);

function datacheck() {
  let data = GetJsonData(Stage, Part);
  AppendText(data);
  AppendImg(data);
}

function moveForwards() {
  let where = GetJsonData(Stage);
  setTimeout(() => {
    if (Part + 1 < where[0].parts.length) {
      Part++;
      datacheck();
    } else if (Stage == 3 && Part + 1 == where[0].parts.length) {
      document.querySelector(".Instructions").textContent = "";
    } else {
      Part = 0;
      Stage++;
      datacheck();
    }
  }, 50);
}
let clickFunc = function() {
  if (this.dataset.what == "bottom" || this.dataset.what == "img") {
    moveForwards();
  }
};
function listen() {
  const element = document.querySelectorAll(".click");
  element.forEach(e => {
    e.addEventListener("click", (e = clickFunc));
  });
}
