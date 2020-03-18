export let AppendText = function(data) {
  const upperText = document.querySelector(".UpperText");
  const bottomText = document.querySelector(".BottomText");

  setTimeout(() => {
    console.log(data[0]);
    upperText.textContent = data[0].textUpper;
    bottomText.textContent = data[0].instruction;
  }, 1000);
};
