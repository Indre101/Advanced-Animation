import gsap from "gsap";
import Snap from "snapsvg";

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
  addAnimationToTheLampLid();
}

function createDraggableContainer(createdSvg, parent, container, img) {
  parent.classList.add("movableitemContainer");
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
  // parent.appendChild(svg);
  container.appendChild(parent);
}

function createNONContainer(parent) {
  parent.classList.add("NOTmovableitemContainer");
}

// ANIMATION PARTS

function addAnimationToTheLampLid() {
  if (document.querySelector(".ImageContainer[data-chapter=lvl2-p1]")) {
    document.querySelector("#lamp_lid").dataset.lifted = "true";
    console.log(document.querySelector("#lamp_lid"));
  } else if (document.querySelector(".ImageContainer[data-chapter=lvl1-p4]")) {
    AnimateColloredOilLamp();
  } else if (document.querySelector("svg[data-name=switch-1")) {
    const switchElement = document.querySelector("svg[data-name=switch-1");
    switchElement.addEventListener("click", clickedImage);
  }
}

// LEVEL THREE

function clickedImage() {
  console.log("imageClickde");

  const btnOutline = document.querySelector("#outlinebutton");
  gsap.to(btnOutline, 1, {
    rotation: 180,
    transformOrigin: "center",
    duration: 1
  });
  // toMorph("#switchOne", "#outlinebutton", "#outlineSwitchOn", 1500);
}

// LEVELTWO

export function AnimateColloredOilLamp() {
  console.log("object");
  repeatingMorphing(
    "#oiLampColorised",
    "#smallLight",
    "#lightStrokeLarge",
    1200
  );
  setTimeout(() => {
    gsap.fromTo(
      ".firedot",
      {
        y: 100,
        scale: 0.2,
        duration: 5,
        opacity: 0,
        ease: "stepped",
        repeat: -1
      },
      {
        y: 0,
        scale: 1.2,
        duration: 5,
        opacity: 1,
        stagger: 0.5,
        ease: "stepped",
        repeat: -1
      }
    );
  }, 1000);
}

// ANIMATIONS
function repeatingMorphing(svgId, firstPath, pathToMorphto, duration) {
  document.querySelector("#light").dataset.show = "true";

  const svg = document.querySelector(svgId);
  const s = Snap(svg);
  const firstElement = Snap.select(firstPath);
  const secondElement = Snap.select(pathToMorphto);
  const firstElementPoints = firstElement.node.getAttribute("d");
  const secondElementPoints = secondElement.node.getAttribute("d");

  const toPreviousPath = function() {
    firstElement.animate(
      { d: secondElementPoints },
      duration,
      mina.backout,
      toNextPath
    );
  };
  const toNextPath = function() {
    firstElement.animate(
      { d: firstElementPoints },
      duration,
      mina.backout,
      toPreviousPath
    );
  };
  toNextPath();
}

function toMorph(svgId, firstPath, pathToMorphto, duration) {
  const svg = document.querySelector(svgId);
  const s = Snap(svg);
  const firstElement = Snap.select(firstPath);
  const secondElement = Snap.select(pathToMorphto);
  const firstElementPoints = firstElement.node.getAttribute("d");
  const secondElementPoints = secondElement.node.getAttribute("d");

  const morphing = function() {
    firstElement.animate({ d: secondElementPoints }, duration, mina.easeout);
  };
  morphing();
}
