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
  listen();
}
let clickFunc = function() {
  DraggElement();
  const level = document.querySelector(".ImageContainer").dataset.chapter;
  console.log(level);
  if (level === "lvl1-p5") {
    activateAnimation("friction");
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
      const ImageContainer = document.querySelector(".ImageContainer");
      ImageContainer.innerHTML += `<div class="mo-fire">
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="125px" height="189.864px" viewBox="0 0 125 189.864" enable-background="new 0 0 125 189.864" xml:space="preserve">
<path class="flame-main" fill="#F36E21" d="M76.553,186.09c0,0-10.178-2.976-15.325-8.226s-9.278-16.82-9.278-16.82s-0.241-6.647-4.136-18.465
	c0,0,3.357,4.969,5.103,9.938c0,0-5.305-21.086,1.712-30.418c7.017-9.333,0.571-35.654-2.25-37.534c0,0,13.07,5.64,19.875,47.54
	c6.806,41.899,16.831,45.301,6.088,53.985"/>
<path class="flame-main one" fill="#F6891F" d="M61.693,122.257c4.117-15.4,12.097-14.487-11.589-60.872c0,0,32.016,10.223,52.601,63.123
	c20.585,52.899-19.848,61.045-19.643,61.582c0.206,0.537-19.401-0.269-14.835-18.532S57.576,137.656,61.693,122.257z"/>
<path class="flame-main two" fill="#FFD04A" d="M81.657,79.192c0,0,11.549,24.845,3.626,40.02c-7.924,15.175-21.126,41.899-0.425,64.998
	C84.858,184.21,125.705,150.905,81.657,79.192z"/>
<path class="flame-main three" fill="#FDBA16" d="M99.92,101.754c0,0-23.208,47.027-12.043,80.072c0,0,32.741-16.073,20.108-45.79
	C95.354,106.319,99.92,114.108,99.92,101.754z"/>
<path class="flame-main four" fill="#F36E21" d="M103.143,105.917c0,0,8.927,30.753-1.043,46.868c-9.969,16.115-14.799,29.041-14.799,29.041
	S134.387,164.603,103.143,105.917z"/>
<path class="flame-main five" fill="#FDBA16" d="M62.049,104.171c0,0-15.645,67.588,10.529,77.655C98.753,191.894,69.033,130.761,62.049,104.171z"/>
<path class="flame" fill="#F36E21" d="M101.011,112.926c0,0,8.973,10.519,4.556,16.543C99.37,129.735,106.752,117.406,101.011,112.926z"/>
<path class="flame one" fill="#F36E21" d="M55.592,126.854c0,0-3.819,13.29,2.699,16.945C64.038,141.48,55.907,132.263,55.592,126.854z"/>
<path class="flame two" fill="#F36E21" d="M54.918,104.595c0,0-3.959,6.109-1.24,8.949C56.93,113.256,52.228,107.329,54.918,104.595z"/>
</svg>
</div>`;
    }, 1020);
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
    console.log(count);
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
  // const element = document.querySelectorAll(".click");
  // element.forEach(e => {
  //   e.addEventListener("click", (e = clickFunc));
  // });
  setTimeout(() => {
    const element2 = document.querySelectorAll(".NOTmovableitemContainer");
    element2.forEach(e => {
      e.addEventListener("click", (e = clickFunc));
    });
  }, 1500);
}
