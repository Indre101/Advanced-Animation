export let AppendText = function(data) {
  const upperText = document.querySelector(".UpperText");
  const bottomText = document.querySelector(".Instructions");

  setTimeout(() => {
    upperText.textContent = data[0].textUpper;
    bottomText.textContent = data[0].instruction;
  }, 1000);
};
