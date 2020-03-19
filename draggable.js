import { GetJsonData } from "./modules/ImportJson.js";
import { gsap } from "gsap";
import interact from "interactjs";

// enable draggables to be dropped into this
interact(".dropzone").dropzone({
  // only accept elements matching this CSS selector
  accept: "#yes-drop",
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function(event) {
    // add active dropzone feedback
    event.target.classList.add("drop-active");
  },
  ondragenter: function(event) {
    var draggableElement = event.relatedTarget;
    var dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add("drop-target");
    draggableElement.classList.add("can-drop");
    draggableElement.textContent = "Dragged in";
  },
  ondragleave: function(event) {
    // remove the drop feedback style
    event.target.classList.remove("drop-target");
    event.relatedTarget.classList.remove("can-drop");
    event.relatedTarget.textContent = "Dragged out";
  },
  ondrop: function(event) {
    event.relatedTarget.textContent = "Dropped";
  },
  ondropdeactivate: function(event) {
    // remove active dropzone feedback
    event.target.classList.remove("drop-active");
    event.target.classList.remove("drop-target");
  }
});

interact(".drag-drop").draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: true
    })
  ],
  autoScroll: true,
  // dragMoveListener from the dragging demo above
  listeners: { move: dragMoveListener }
});

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
