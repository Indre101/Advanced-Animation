export function AppendImg(data) {
  const ImageContainer = document.querySelector(".ImageContainer");
  setTimeout(() => {
    if (data[0].media.length > 0) {
      data[0].media.forEach(e => {
        console.log(e);
        ImageContainer.innerHTML +=
          `<img src="images/level-images/` + e + `" alt=""></img>`;
      });
    } else {
      ImageContainer.innerHTML +=
        `<img src="images/level-images/` + data[0].media + `" alt=""></img>`;
    }
  }, 1000);
}
