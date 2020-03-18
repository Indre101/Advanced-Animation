import { GetJsonData } from "./modules/ImportJson.js";
document.addEventListener("DOMContentLoaded", init);

function getHTMLElements() {
  const HTML = {};
  HTML.StoryContainer = document.querySelector(".StoryContainer");
  HTML.Story = document.querySelector(".Story");
  HTML.UpperText = document.querySelector(".UpperText");
  HTML.ImageContainer = document.querySelector(".ImageContainer");
  HTML.Instructions = document.querySelector(".Instructions");
  return HTML;
}

function init() {
  fetch("data/data.json")
    .then(res => res.json())
    .then(data => {
      datacheck(data);
    });
}

function datacheck(data) {
  showLevelInfo(data[2]);
}

function showLevelInfo(story) {
  story.parts.forEach(showParts);
}

function showParts(part) {
  const HTML = getHTMLElements();
  // HTML.ImageContainer.innerHTML = " ";
  HTML.UpperText.textContent = part.textUpper;
  HTML.Instructions.textContent = part.instruction;
  part.media.forEach(img => createImage(img, HTML));
}

function createImage(img, HTML) {
  const newImg = document.createElement("img");
  newImg.src = `images/level-images/${img}`;
  HTML.ImageContainer.appendChild(img);
}
