import { GetJsonData } from "./modules/ImportJson.js";
import { gsap } from "gsap";
import d3 from "d3-drag";

function started() {
  var circle = d3.select(this).classed("dragging", true);

  d3.event.on("drag", dragged).on("end", ended);

  function dragged(d) {
    circle
      .raise()
      .attr("cx", (d.x = d3.event.x))
      .attr("cy", (d.y = d3.event.y));
  }

  function ended() {
    circle.classed("dragging", false);
  }
}
// document.addEventListener("DOMContentLoaded", init);

// function getHTMLElements() {
//   const HTML = {};
//   HTML.StoryContainer = document.querySelector(".StoryContainer");
//   HTML.Story = document.querySelector(".Story");
//   HTML.UpperText = document.querySelector(".UpperText");
//   HTML.ImageContainer = document.querySelector(".ImageContainer");
//   HTML.Instructions = document.querySelector(".Instructions");
//   return HTML;
// }

// function init() {
//   fetch("data/data.json")
//     .then(res => res.json())
//     .then(data => {
//       getData(data);
//     });
// }

// function getData(data) {
//   // data.forEach(showLevelInfo);
//   showLevelInfo(data[2]);
// }

// function showLevelInfo(story) {
//   // story.parts[2].forEach(showParts);
//   console.log(story.parts);

//   showParts(story.parts[2]);
// }

// function showParts(part) {
//   const HTML = getHTMLElements();
//   HTML.ImageContainer.innerHTML = " ";
//   HTML.UpperText.textContent = part.textUpper;
//   HTML.Instructions.textContent = part.instruction;
//   part.media.forEach(img => createImage(img, HTML));
// }

// function createImage(img, HTML) {
//   console.log(img);
//   const newImg = document.createElement("img");
//   newImg.src = `images/level-images/${img.src}`;

//   HTML.ImageContainer.appendChild(newImg);
// }
