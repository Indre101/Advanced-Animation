import interact from "interactjs";
import gsap from "gsap";
// enable draggables to be dropped into this

export function DraggElement() {
  interact(".draggableItem").draggable({
    listeners: {
      // call this function on every dragmoveevent
      move: dragMoveListener
    }
  });
}
function dragMoveListener(event) {
  const target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

interact(".dropzone").dropzone({
  // only accept elements matching this CSS selector
  accept: ".draggableItem",
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondragenter: function(event) {
    // feedback the possibility of a drop
    event.target.dataset.moving = "hovering";
  },

  ondragleave: function(event) {
    // remove the drop feedback style
    event.target.dataset.moving = "activeMoving";

    // event.target.dataset.moving = " ";
    // event.relatedTarget.classList.remove("can-drop");
  },

  ondrop: function(event) {
    console.log(event.target);
    event.target.dataset.moving = "dropped";
    interact(".draggableItem").unset();
    fillTheLamp();
  },

  // ondropdeactivate: function(event) {
  //   // remove active dropzone feedback
  //   event.target.dataset.moving = "activeMoving";
  // },

  ondropactivate: function(event) {
    event.target.dataset.moving = "activeMoving";
    // add active dropzone feedback
  }
});

function fillTheLamp() {
  // THE LAMP LIQUID
  const oilLamp = document.querySelector("#theSquare");
  console.log(oilLamp);

  gsap.fromTo(
    oilLamp,
    0.8,
    {
      attr: {
        x: -400
      }
    },
    {
      attr: {
        x: 0
      },
      repeat: 30
    }
  );

  // "Fill up" animation
  gsap.fromTo(
    oilLamp,
    10,
    {
      attr: {
        y: 420,
        height: 0
      }
    },
    {
      attr: {
        y: -20,
        height: 440
      }
    }
  );

  // THE FLASK ITEM
  const flask = document.querySelector(".draggableItem");
  gsap.to(flask, {
    rotation: 110,
    duration: 3
  });
  console.log(flask);

  // THE FLASKOIL
  const flaskOil = document.querySelector("#flaskOil");
  console.log(flaskOil);
  const tl = gsap.timeline();

  tl.fromTo(
    flaskOil,
    2,
    {
      y: 0,
      x: 0,
      yoyo: true,
      rotation: 0,
      repeat: -1
    },
    {
      y: 200,
      x: -250,

      rotation: 70,
      transformOrigin: "center",
      repeat: -1
    }
  );

  // const tl = gsap.timeline();

  // gsap.to(flaskOil, {
  //   rotation: -30,
  //   transformOrigin: "top",
  //   ease: "elastic",
  //   duration: 5
  // });

  // gsap.fromTo(
  //   flaskOil,

  //   {
  //     duration: 15,
  //     y: 0,
  //     height: 640
  //   },
  //   {
  //     duration: 15,
  //     y: 1000,
  //     height: 0
  //   }
  // );

  // gsap.fromTo(
  //   flaskOil,
  //   {
  //     x: -1000,
  //     duration: 5
  //   },
  //   {
  //     x: 0,
  //     repeat: 30,
  //     duration: 5
  //   }
  // );
}
