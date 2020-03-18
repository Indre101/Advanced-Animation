import { GetJsonData } from "./modules/ImportJson.js";

function getHTMLElements() {
  const HTML = {};
  HTML.StoryContainer = document.querySelector(".StoryContainer");
  HTML.Story = document.querySelector(".Story");
  HTML.UpperText = document.querySelector(".UpperText");
  HTML.ImageContainer = document.querySelector(".ImageContainer");
  HTML.Instructions = document.querySelector(".Instructions");
  return HTML;
}

document.addEventListener("DOMContentLoaded", init);

function init() {
  fetch("data/data.json")
    .then(res => res.json())
    .then(data => {
      datacheck(data);
    });
}

function datacheck(data) {
  showLevelInfo(data[0]);
  // data.forEach(showLevelInfo);
}

function showLevelInfo(story) {
  story.parts.forEach(showParts);
}

function showParts(part) {
  const HTML = getHTMLElements();
  HTML.ImageContainer.innerHTML = " ";

  HTML.UpperText.textContent = part.textUpper;
  HTML.Instructions.textContent = part.instruction;
}

function createImage(img, HTML) {
  const newImg = document.createElement("img");
  newImg.src = `./static/images/level-images/${img}`;
  HTML.ImageContainer.appendChild(img);
}
// id: 0
// name: "Start"
// parts: Array(1)
// 0:
// id: "lvl0-p0"
// media: ["play.svg"]
// textUpper: "How controlling light changed the world."
// instruction: "A short interactive experience"
