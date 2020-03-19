import { GetJsonData } from "./modules/ImportJson.js";
import { AppendText } from "./modules/appendText.js";
import { AppendImg } from "./modules/appendImg.js";
let Stage = 0;
let Part = 0;
document.addEventListener("DOMContentLoaded", datacheck(0, 0));
document.addEventListener("DOMContentLoaded", listen);
async function datacheck(Stages, Parts) {
  const data = await GetJsonData(Stage, Part);
  console.log(Stage, Part);
  AppendText(data);
  AppendImg(data);
}
async function moveForwards() {
  let where = await GetJsonData(Stage);
  console.log(where);
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
