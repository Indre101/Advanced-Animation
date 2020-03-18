export function AppendImg(data) {
  const ImageContainer = document.querySelector(".ImageContainer");
  setTimeout(() => {
    ImageContainer.innerHTML = "";
    if (data[0].media.length > 0) {
      data[0].media.forEach(e => {
        ImageContainer.innerHTML +=
          `<img data-what="img" class="IMGclicked click" src="images/level-images/` +
          e +
          `" alt=""></img>`;
      });
    } else {
      ImageContainer.innerHTML =
        `<img data-what="img" class="IMGclicked click" src="images/level-images/` +
        data[0].media +
        `" alt=""></img>`;
    }
  }, 1000);
}
