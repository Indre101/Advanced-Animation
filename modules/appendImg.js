import interact from "interactjs";
import { gsap } from "gsap";
export const AppendImg = data => {
  const ImageContainer = document.querySelector(".ImageContainer");
  gsap.to(ImageContainer, {
    duration: 1,
    opacity: 0
  });
  setTimeout(() => {
    ImageContainer.innerHTML = "";
    gsap.to(ImageContainer, {
      duration: 1,
      opacity: 1
    });
    ImageContainer.dataset.chapter = data[0].id;
    if (data[0].media.length > 0) {
      data[0].media.forEach(e => {
        createSvg(e, ImageContainer);
      });
    } else {
      createSvg(data[0].media[0], ImageContainer);
    }
  }, 1000);
};

async function createSvg(img, container) {
  const parent = document.createElement("div");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Append timeline  to a div
  const responseSvg = await fetch(`images/level-images/${img.src}`);
  const svgText = await responseSvg.text();
  // svg.setAttribute("href", `images/level-images/${img}`);
  svg.setAttribute("class", `IMGclicked click`);
  svg.setAttribute("viewBox", "0 0 300 300");
  svg.setAttribute("class", "svgContainer");
  svg.dataset.name = img.src.substring(0, img.src.length - 4);
  svg.innerHTML = svgText;
  const addName = img.src.substring(0, img.src.length - 4);
  img.draggable
    ? createDraggableContainer(svg, parent, container, img)
    : createNONContainer(parent, addName);
  parent.appendChild(svg);
  container.appendChild(parent);
  addAnimationToTheLampLid();
}

function createDraggableContainer(createdSvg, parent, container, img) {
  parent.classList.add("movableitemContainer");
  parent.dataset.name = img.src.substring(0, img.src.length - 4);
  createdSvg.classList.add(`draggableItem`);
  createDropZone(img, container);
}

async function createDropZone(img, container) {
  const parent = document.createElement("div");
  // const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const responseSvg = await fetch(`images/level-images/${img.src}`);
  const svgText = await responseSvg.text();
  parent.innerHTML = svgText;
  parent.classList.add("dropzone");
  parent.dataset.moving = "";
  parent.dataset.name = img.src.substring(0, img.src.length - 4);
  // parent.appendChild(svg);
  container.appendChild(parent);
}

function createNONContainer(parent, addName) {
  parent.classList.add("NOTmovableitemContainer");
  parent.dataset.name = addName;
}

function addAnimationToTheLampLid() {
  if (document.querySelector(".ImageContainer[data-chapter=lvl2-p1]")) {
    document.querySelector("#lamp_lid").dataset.lifted = "true";
    console.log(document.querySelector("#lamp_lid"));
  }
}
