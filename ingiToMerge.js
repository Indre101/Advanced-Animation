import { GetJsonData } from "./modules/ImportJson.js";
import { AppendText } from "./modules/appendText.js";
import { AppendImg } from "./modules/appendImg.js";
import { DraggElement } from "./modules/Draggable";
import { gsap } from "gsap";
import { AnimateColloredOilLamp } from "./modules/Draggable";

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
    if (Stage === 1 && Part === 5) {
      window.open("./index-levelTwoThree.html", "_self");
      Stage = 0;
      Part = 0;
    } else if (Part + 1 < where[0].parts.length) {
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
  listen();
}
let clickFunc = function() {
  DraggElement();
  const level = document.querySelector(".ImageContainer").dataset.chapter;
  if (level === "lvl1-p5") {
  } else if (level != "lvl1-p5" && level != "lvl1-p3") {
    moveForwards();
  }
  // if (this.dataset.what == "bottom" || this.dataset.what == "[img]") {

  // }
};

function chapterAnimation() {
  const container = document.querySelector(".ImageContainer");
  if (container.dataset.chapter == "lvl1-p2") {
    setTimeout(() => {
      const check = setInterval(isDropped, 1000);
      function isDropped() {
        const dropZone = document.querySelector(".dropzone");
        if (dropZone.dataset.moving == "dropped") {
          clearInterval(check);
          let whichOne = "chop";
          activateAnimation(whichOne);
        }
      }
    }, 1000);
  }
  //// All of these if statements are checking the current one when beign clicked, after clicking it's moved forwards and the level is higher
  //// For example here lvl1-p3 is the level before I activate the animation After.
  if (container.dataset.chapter == "lvl1-p3") {
    setTimeout(() => {
      let whichOne = "After";
      activateAnimation(whichOne);
    }, 1000);
  }

  if (container.dataset.chapter == "lvl1-p4") {
    let whichOne = "friction";
    activateAnimation(whichOne);
  }
  if (container.dataset.chapter == "lvl1-p5") {
    setTimeout(() => {
      const camp = document.querySelector("#camp");
      // const girls = camp.querySelector("#Girls");
      // girls.setAttribute("fill", "none");
    }, 1500);
  }
}
let count = 0;
const dofriction = function() {
  const condition = isOdd(count);
  if (condition == false) {
    gsap.to(this, {
      duration: 0.2,
      y: +20
    });
    gsap.to(this, {
      duration: 0.2,
      x: -50
    });
  } else if (count == 12) {
    moveForwards();
  } else {
    gsap.to(this, {
      duration: 0.2,
      x: +100
    });
    gsap.to(this, {
      duration: 0.2,
      y: +20
    });
  }
  function isOdd(num) {
    count++;
    return num % 2 == 1;
  }
};

function activateAnimation(whichOne) {
  listen();
  if (whichOne == "chop") {
    gsap.to(".movableitemContainer", {
      ease: "back.out(2)",
      duration: 0.5,
      y: -120,
      x: -140,
      rotation: 40
    });
    gsap.to(".movableitemContainer", {
      delay: 0.5,
      duration: 0.5,
      y: -130,
      x: -120
    });
    gsap.to(".movableitemContainer", {
      delay: 1,
      duration: 0.5,
      y: -120,
      x: -140
    });
    gsap.to(".movableitemContainer", {
      delay: 1.5,
      duration: 0.5,
      y: -250,
      x: -250,
      rotation: 0
    });
    gsap.to(".movableitemContainer", {
      delay: 2,
      duration: 0.3,
      ease: "expo.out",
      y: +100,
      x: +150,
      rotation: 90
    });
    gsap.to(`[data-name="woodChopped-2"]`, {
      delay: 2.1,
      duration: 0.3,
      ease: "expo.out",
      y: -90,
      x: +150,
      rotation: 90
    });
    gsap.to(`[data-name="woodChopped-1"]`, {
      delay: 2.1,
      duration: 0.3,
      ease: "expo.out",
      y: -10,
      x: -100,
      rotation: 30
    });
    setTimeout(() => {
      moveForwards();
    }, 3000);
    setTimeout(() => {
      activateAnimation("After");
    }, 4000);

    //find this
  } else if (whichOne == "After") {
    setTimeout(() => {
      gsap.to(`[data-name="stick"]`, {
        repeat: -1,
        duration: 1,
        ease: "bounce.out",
        y: 10
      });
    }, 1000);
  } else if (whichOne == "friction") {
    setTimeout(() => {
      const hands = document.querySelector(`[data-name="firctionHands"]`);
      hands.addEventListener("click", dofriction);
    }, 2000);
  }
}

function listen() {
  setTimeout(() => {
    const element2 = document.querySelectorAll(".NOTmovableitemContainer");
    element2.forEach(e => {
      e.addEventListener("click", (e = clickFunc));
    });
  }, 1500);
}
