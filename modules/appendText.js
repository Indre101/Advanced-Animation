import { gsap } from "gsap";
export let AppendText = function(data) {
  const upperText = document.querySelector(".UpperText");
  const bottomText = document.querySelector(".Instructions");
  gsap.to(upperText, {
    duration: 1,
    opacity: 0
  });
  gsap.to(bottomText, {
    duration: 1,
    opacity: 0
  });
  setTimeout(() => {
    gsap.to(upperText, {
      duration: 1,
      opacity: 1
    });
    gsap.to(bottomText, {
      duration: 1,
      opacity: 1
    });
    upperText.textContent = data[0].textUpper;
    bottomText.textContent = data[0].instruction;
  }, 1000);
};
