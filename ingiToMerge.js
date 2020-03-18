import { GetJsonData } from "./modules/ImportJson.js";

document.addEventListener("DOMContentLoaded", datacheck);

function datacheck() {
  let level = 0;
  const data = GetJsonData(level);
  console.log(GetJsonData(level));
}
