export function AppendImg(data) {
  const ImageContainer = document.querySelector(".ImageContainer");
  setTimeout(() => {
    ImageContainer.innerHTML = "";
    if (data[0].media.length > 0) {
      data[0].media.forEach(e => {
        console.log(e);
        ImageContainer.innerHTML +=
          `<img data-what="img" class="IMGclicked click" src="images/level-images/` +
          e.src +
          `" alt=""></img>`;
      });
    } else {
      ImageContainer.innerHTML =
        `<img data-what="img" class="IMGclicked click" src="images/level-images/` +
        data[0].media[0].src +
        `" alt=""></img>`;
    }
  }, 500);
}
