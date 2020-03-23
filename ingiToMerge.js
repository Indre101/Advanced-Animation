import { GetJsonData } from "./modules/ImportJson.js";
import { AppendText } from "./modules/appendText.js";
import { AppendImg } from "./modules/appendImg.js";
import { DraggElement } from "./modules/Draggable";
import { gsap } from "gsap";
import { AnimateDraggableObjects } from "./modules/Draggable";

let Stage = 0;
let Part = 0;
document.addEventListener("DOMContentLoaded", datacheck(0, 0));
document.addEventListener("DOMContentLoaded", listen);
async function datacheck(Stages, Parts) {
  const data = await GetJsonData(Stage, Part);
  AppendText(data);
  AppendImg(data);
  activateAnimation();
}
async function moveForwards() {
  let where = await GetJsonData(Stage);
  setTimeout(() => {
    if (Part + 1 < where[0].parts.length) {
      Part++;
      datacheck();
    } else if (Stage == 3 && Part + 1 == where[0].parts.length) {
      document.querySelector(".Instructions").textContent = "";
    } else {
      Part = 0;
      Stage++;

      datacheck();
    }
  }, 50);
  chapterAnimation();
}
let clickFunc = function() {
  DraggElement();

  if (this.dataset.what == "bottom" || this.dataset.what == "img") {
    console.log(this);
    moveForwards();
  }
};

function chapterAnimation() {
  const container = document.querySelector(".ImageContainer");

  if (container.dataset.chapter == "lvl1-p2") {
    const check = setInterval(isDropped, 1000);
    function isDropped() {
      const dropZone = document.querySelector(".dropzone");
      if (dropZone.dataset.moving == "dropped") {
        clearInterval(check);
        let whichOne = "chop";
        activateAnimation(whichOne);
      }
    }
  }
}
function activateAnimation(whichOne) {
  gsap.from("#upperText", { opacity: 0, duration: 1, y: -100 });
  gsap.from(".Instructions", { opacity: 0, duration: 1, y: +100 });

  if (whichOne == "chop") {
    gsap.to(".movableitemContainer", {
      ease: "back.out(2)",
      duration: 0.5,
      y: -150,
      x: -50,
      rotation: 40
    });
    gsap.to(".movableitemContainer", {
      delay: 0.5,
      duration: 0.5,
      y: -140,
      x: -40
    });
    gsap.to(".movableitemContainer", {
      delay: 1,
      duration: 0.5,
      y: -150,
      x: -50
    });

    gsap.to(".movableitemContainer", {
      delay: 1.5,
      duration: 0.3,
      ease: "expo.out",
      y: +100,
      x: +150,
      rotation: 90
    });
  }
}

function listen() {
  const element = document.querySelectorAll(".click");
  element.forEach(e => {
    e.addEventListener("click", (e = clickFunc));
  });
}
