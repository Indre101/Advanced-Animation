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
  const flask = document.querySelector("#lamp #theSquare");
  console.log(flask);
  // gsap.to(flask, 5, { fill: "rgb(255,0,255)" });
  // gsap.to(flask, 2, { fill: "rgb(255,0,255)", transformOrigin: " 50% 100%" });
  // gsap.from(flask, 2, {
  //   attr: { y: 1000 },
  //   fill: "rgb(255,0,255)",
  //   repeat: -1
  // });
  gsap.to(flask, 2, { attr: { y: -1000 }, yoyo: true, repeat: -1 });
}
