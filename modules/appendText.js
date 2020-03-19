export let AppendText = function(data) {
  const upperText = document.querySelector(".UpperText");
  const bottomText = document.querySelector(".Instructions");
  upperText.textContent = data[0].textUpper;
  bottomText.textContent = data[0].instruction;
};
