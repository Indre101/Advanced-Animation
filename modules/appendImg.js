import interact from "interactjs";

export const AppendImg = data => {
  const ImageContainer = document.querySelector(".ImageContainer");
  ImageContainer.innerHTML = "";
  ImageContainer.dataset.chapter = data[0].id;
  if (data[0].media.length > 0) {
    data[0].media.forEach(e => {
      createSvg(e, ImageContainer);
    });
  } else {
    createSvg(data[0].media[0], ImageContainer);
  }
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
  img.draggable
    ? createDraggableContainer(svg, parent, container, img)
    : createNONContainer(parent);
  parent.appendChild(svg);
  container.appendChild(parent);
}

function createDraggableContainer(createdSvg, parent, container, img) {
  parent.classList.add("movableitemContainer");
  createdSvg.classList.add(`draggableItem`);
  createDropZone(img, container);
}

async function createDropZone(img, container) {
  console.log(img);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const responseSvg = await fetch(`images/level-images/${img.src}`);
  const svgText = await responseSvg.text();
  svg.innerHTML = svgText;
  svg.classList.add("dropzone");
  container.appendChild(svg);
}

function createNONContainer(parent) {
  parent.classList.add("NOTmovableitemContainer");
}
