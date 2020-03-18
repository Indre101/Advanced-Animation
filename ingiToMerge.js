import { GetJsonData } from "./modules/ImportJson.js";
import { AppendText } from "./modules/appendText.js";

document.addEventListener("DOMContentLoaded", datacheck);

function datacheck() {
  let stage = 2;
  let part = 3;
  let data = GetJsonData(stage, part);

  deligator(data);
}

function deligator(data) {
  AppendText(data);
}
