import { GetJsonData } from "./modules/ImportJson.js";
import { AppendText } from "./modules/appendText.js";
import { AppendImg } from "./modules/appendImg.js";

document.addEventListener("DOMContentLoaded", datacheck);
function datacheck() {
  let stage = 2;
  let part = 3;
  let data = GetJsonData(stage, part);
  AppendText(data);
  AppendImg(data);
}
